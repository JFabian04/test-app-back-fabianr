import "reflect-metadata";
import { UserService } from "../../infrastructure/http/services/user.service";
import { UserRepository } from "../../domain/ports/UserRepository";
import { User } from "../../domain/entities/User";
import { UserAlreadyExistsError } from "../../domain/errors/UserAlreadyExistsError";

describe("UserService", () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockUserRepository = {
            findAll: jest.fn(),
            findAllPaginated: jest.fn(),
            save: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
        };

        userService = new UserService(mockUserRepository);
    });

    describe("getAllUsers", () => {
        it("should return all users", async () => {
            const mockUsers: User[] = [
                new User("John Doe", "john@example.com", "1"),
                new User("Jane Doe", "jane@example.com", "2"),
            ];

            (mockUserRepository.findAll as jest.Mock).mockResolvedValue(mockUsers);

            const result = await userService.getAllUsers();

            expect(result).toEqual(mockUsers);
            expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe("getUsersPaginated", () => {
        it("should return paginated users", async () => {
            const mockResult = {
                data: [new User("John Doe", "john@example.com", "1")],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1,
                },
            };

            (mockUserRepository.findAllPaginated as jest.Mock).mockResolvedValue(mockResult);

            const result = await userService.getUsersPaginated({ page: 1, limit: 10 });

            expect(result).toEqual(mockResult);
            expect(mockUserRepository.findAllPaginated).toHaveBeenCalledWith({ page: 1, limit: 10 });
        });
    });

    describe("create", () => {
        it("should create a new user successfully", async () => {
            const newUser = new User("Test User", "test@example.com");

            (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
            (mockUserRepository.save as jest.Mock).mockResolvedValue(undefined);

            await userService.create(newUser);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
            expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
        });

        it("should throw error if user with email already exists", async () => {
            const existingUser = new User("Existing User", "test@example.com", "1");
            const newUser = new User("Test User", "test@example.com");

            (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(existingUser);

            await expect(userService.create(newUser))
                .rejects
                .toThrow(UserAlreadyExistsError);
            expect(mockUserRepository.save).not.toHaveBeenCalled();
        });
    });
});
