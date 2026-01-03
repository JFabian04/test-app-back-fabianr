import { UserRepository, PaginatedResult, PaginationParams } from "../../../domain/ports/UserRepository";
import { User } from "../../../domain/entities/User";
import { injectable, inject } from "tsyringe";
import { HttpException } from "../errors/HttpException";
import { UserAlreadyExistsError } from "../../../domain/errors/UserAlreadyExistsError";

@injectable()
export class UserService {
	constructor(
		@inject("UserRepository")
		private readonly userRepository: UserRepository
	) {}
	async getAllUsers(): Promise<User[]> {
		return this.userRepository.findAll();
	}
	async getUsersPaginated(params: PaginationParams): Promise<PaginatedResult<User>> {
		return this.userRepository.findAllPaginated(params);
	}
	async create(user: User): Promise<void> {
		const existing = await this.userRepository.findByEmail?.(user.email);
		if (existing?.email) {
			throw new UserAlreadyExistsError(user.email);
		}
		return this.userRepository.save(user);
	}

	async getById(id: string): Promise<User> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new HttpException(404, "User not found", "USER_NOT_FOUND");
		}
		return user;
	}

	async update(id: string, data: Partial<User>): Promise<User> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new HttpException(404, "User not found", "USER_NOT_FOUND");
		}

		if (data.email && data.email !== user.email) {
			const existing = await this.userRepository.findByEmail?.(data.email);
			if (existing?.email) {
				throw new UserAlreadyExistsError(data.email);
			}
		}

		await this.userRepository.update(id, data);
		return this.getById(id);
	}

	async softDelete(id: string): Promise<void> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new HttpException(404, "User not found", "USER_NOT_FOUND");
		}
		await this.userRepository.softDelete(id);
	}
}
