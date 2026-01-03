import { UserRepositorySequelize } from "../../infrastructure/db/sequelize/repositories/UserRepositorySequelize";
import { User } from "../../domain/entities/User";

jest.mock("../../infrastructure/db/sequelize/models/user.model", () => ({
	UserModel: {
		findByPk: jest.fn(),
		findOne: jest.fn(),
		findAll: jest.fn(),
		findAndCountAll: jest.fn(),
		create: jest.fn(),
		destroy: jest.fn(),
		update: jest.fn(),
	},
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { UserModel } = require("../../infrastructure/db/sequelize/models/user.model");

describe("UserRepositorySequelize (Adapter/Repository)", () => {
	let repository: UserRepositorySequelize;

	beforeEach(() => {
		jest.clearAllMocks();
		repository = new UserRepositorySequelize();
	});

	describe("findById", () => {
		it("should return user when found by id", async () => {
			const mockUser = {
				id: "123",
				name: "John Doe",
				email: "john@example.com",
			};

			(UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);

			const result = await repository.findById("123");

			expect(UserModel.findByPk).toHaveBeenCalledWith("123");
			expect(result).toBeInstanceOf(User);
			expect(result?.id).toBe("123");
			expect(result?.name).toBe("John Doe");
			expect(result?.email).toBe("john@example.com");
		});

		it("should return null when user not found", async () => {
			(UserModel.findByPk as jest.Mock).mockResolvedValue(null);

			const result = await repository.findById("999");

			expect(UserModel.findByPk).toHaveBeenCalledWith("999");
			expect(result).toBeNull();
		});
	});

	describe("findAllPaginated", () => {
		it("should return paginated users with correct metadata", async () => {
			const mockRows = [
				{ id: "1", name: "User 1", email: "user1@example.com" },
				{ id: "2", name: "User 2", email: "user2@example.com" },
			];

			(UserModel.findAndCountAll as jest.Mock).mockResolvedValue({
				count: 25,
				rows: mockRows,
			});

			const result = await repository.findAllPaginated({ page: 2, limit: 10 });

			expect(UserModel.findAndCountAll).toHaveBeenCalledWith({
				limit: 10,
				offset: 10,
				order: [["createdAt", "DESC"]],
			});

			expect(result.data).toHaveLength(2);
			expect(result.data[0]).toBeInstanceOf(User);
			expect(result.pagination).toEqual({
				page: 2,
				limit: 10,
				total: 25,
				totalPages: 3,
			});
		});

		it("should calculate offset correctly for first page", async () => {
			(UserModel.findAndCountAll as jest.Mock).mockResolvedValue({
				count: 0,
				rows: [],
			});

			await repository.findAllPaginated({ page: 1, limit: 10 });

			expect(UserModel.findAndCountAll).toHaveBeenCalledWith({
				limit: 10,
				offset: 0,
				order: [["createdAt", "DESC"]],
			});
		});
	});

	describe("findByEmail", () => {
		it("should return user when email exists", async () => {
			const mockUser = {
				id: "789",
				name: "Jane Doe",
				email: "jane@example.com",
			};

			(UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

			const result = await repository.findByEmail("jane@example.com");

			expect(UserModel.findOne).toHaveBeenCalledWith({
				where: { email: "jane@example.com" },
			});
			expect(result).toBeInstanceOf(User);
			expect(result?.email).toBe("jane@example.com");
		});

		it("should return null when email not found", async () => {
			(UserModel.findOne as jest.Mock).mockResolvedValue(null);

			const result = await repository.findByEmail("notfound@example.com");

			expect(result).toBeNull();
		});
	});

	describe("save", () => {
		it("should create user in database with correct data", async () => {
			const newUser = new User("Test User", "test@example.com", "456");

			(UserModel.create as jest.Mock).mockResolvedValue(undefined);

			await repository.save(newUser);

			expect(UserModel.create).toHaveBeenCalledWith({
				id: "456",
				name: "Test User",
				email: "test@example.com",
			});
		});
	});

	describe("update", () => {
		it("should update user with correct data and id", async () => {
			(UserModel.update as jest.Mock).mockResolvedValue([1]);

			await repository.update("123", { name: "Updated Name" });

			expect(UserModel.update).toHaveBeenCalledWith(
				{ name: "Updated Name" },
				{ where: { id: "123" } }
			);
		});
	});

	describe("softDelete", () => {
		it("should call destroy with correct id for soft delete", async () => {
			(UserModel.destroy as jest.Mock).mockResolvedValue(1);

			await repository.softDelete("123");

			expect(UserModel.destroy).toHaveBeenCalledWith({ where: { id: "123" } });
		});
	});
});
