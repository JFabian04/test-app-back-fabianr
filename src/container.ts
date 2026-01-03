import { container } from "tsyringe";
import { UserRepository } from "./domain/ports/UserRepository";
import { UserRepositorySequelize } from "./infrastructure/db/sequelize/repositories/UserRepositorySequelize";
import { UserExportService } from "./infrastructure/http/services/user-export.service";

container.register<UserRepository>("UserRepository", {
	useClass: UserRepositorySequelize,
});

container.register(UserExportService, {
	useClass: UserExportService,
});
