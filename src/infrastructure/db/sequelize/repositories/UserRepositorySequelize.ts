import { UserRepository, PaginationParams, PaginatedResult } from "../../../../domain/ports/UserRepository";
import { User } from "../../../../domain/entities/User";
import { UserModel } from "../models/user.model";
import { Op } from "sequelize";

export class UserRepositorySequelize implements UserRepository {
	async findAll(): Promise<User[]> {
		const users = await UserModel.findAll();
		return users.map((u) => new User(u.name, u.email, u.id));
	}

	async findAllPaginated(params: PaginationParams): Promise<PaginatedResult<User>> {
		const { page: requestedPage, limit, search } = params;

		const findOptions: any = {
			order: [["createdAt", "DESC"]],
		};

		if (search && search.trim()) {
			const searchTerm = `%${search.trim()}%`;
			findOptions.where = {
				[Op.and]: [
					{ name: { [Op.like]: searchTerm } }
				]
			};
		}

		const { count } = await UserModel.findAndCountAll({ ...findOptions, attributes: ["id"] });
		const totalPages = Math.ceil(count / limit) || 1;
		const page = Math.min(requestedPage, totalPages);
		const offset = (page - 1) * limit;

		const { rows } = await UserModel.findAndCountAll({
			...findOptions,
			limit,
			offset,
		});

		return {
			data: rows.map((u) => new User(u.name, u.email, u.id)),
			pagination: {
				page,
				limit,
				total: count,
				totalPages,
			},
		};
	}

	async findById(id: string): Promise<User | null> {
		const user = await UserModel.findByPk(id);
		return user ? new User(user.name, user.email, user.id) : null;
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
		return user ? new User(user.name, user.email, user.id) : null;
	}

	async update(id: string, data: Partial<User>): Promise<void> {
		await UserModel.update(data, { where: { id } });
	}

	async softDelete(id: string): Promise<void> {
		await UserModel.destroy({ where: { id } });
	}
}
