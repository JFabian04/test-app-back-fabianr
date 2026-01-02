import { UserRepository, PaginatedResult, PaginationParams } from "../../../domain/ports/UserRepository";
import { User } from "../../../domain/entities/User";
import { injectable, inject } from "tsyringe";
import { HttpException } from "../errors/HttpException";

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
			throw new HttpException(409, "User with this email already exists");
		}
		return this.userRepository.save(user);
	}
}
