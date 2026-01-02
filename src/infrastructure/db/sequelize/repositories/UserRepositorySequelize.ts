import { UserRepository, PaginationParams, PaginatedResult } from "../../../../domain/ports/UserRepository";
import { User } from "../../../../domain/entities/User";
import { UserModel } from "../models/user.model";

export class UserRepositorySequelize implements UserRepository {
	async findAll(): Promise<User[]> {
		const users = await UserModel.findAll();
		return users.map((u) => new User(u.id, u.name, u.email));
	}

	async findAllPaginated(params: PaginationParams): Promise<PaginatedResult<User>> {
		const { page, limit } = params;
		const offset = (page - 1) * limit;

		const { count, rows } = await UserModel.findAndCountAll({
			limit,
			offset,
			order: [["createdAt", "DESC"]],
		});

		return {
			data: rows.map((u) => new User(u.id, u.name, u.email)),
			pagination: {
				page,
				limit,
				total: count,
				totalPages: Math.ceil(count / limit),
			},
		};
	}

	async findById(id: string): Promise<User | null> {
		const user = await UserModel.findByPk(id);
		return user ? new User(user.id, user.name, user.email) : null;
	}

	async save(user: User): Promise<void> {
		await UserModel.create({
			id: user.id,
			name: user.name,
			email: user.email,
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await UserModel.findOne({ where: { email } });
		return user ? new User(user.id, user.name, user.email) : null;
	}
}
