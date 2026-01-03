import { User } from "../entities/User";

export interface PaginationParams {
	page: number;
	limit: number;
	search?: string;
}

export interface PaginatedResult<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface UserRepository {
	findAll(): Promise<User[]>;
	findAllPaginated(params: PaginationParams): Promise<PaginatedResult<User>>;
	findById(id: string): Promise<User | null>;
	save(user: User): Promise<void>;
	update(id: string, data: Partial<User>): Promise<void>;
	softDelete(id: string): Promise<void>;
	findByEmail?(email: string): Promise<User | null>;
}
