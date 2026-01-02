import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import UserRoute from "./infrastructure/http/routes/v1/user.route";
import { sequelize } from "./config/database";
import { errorHandler } from "./infrastructure/http/middlewares/error.middleware";
import logger from "./utils/logger";
import { swaggerSpec } from "./config/swagger.config";
import v1Routes from "./infrastructure/http/routes/v1";

export default class App {
	public app: Application;
	private readonly port: number | string;

	constructor(port: number | string = 3000) {
		this.app = express();
		this.port = port;

		this.initializeMiddlewares();
		this.initializeRoutes();
		this.initializeDatabase();
		this.initializeSyncDatabase();
		this.initializeErrorHandling();
	}

	private initializeMiddlewares(): void {
		this.app.use(helmet());
		this.app.use(
			cors({
				origin: process.env.CORS_ORIGIN || "*",
				credentials: true,
			})
		);

		const limiter = rateLimit({
			windowMs: 15 * 60 * 1000,
			max: 100,
			message: "Too many requests from this IP, please try again later.",
			standardHeaders: true,
			legacyHeaders: false,
		});
		this.app.use(limiter);

		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private initializeRoutes(): void {
		this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
		this.app.use("/api/v1", v1Routes);
	}
	private initializeErrorHandling(): void {
		this.app.use(errorHandler);
	}

	private initializeDatabase(): void {
		sequelize
			.authenticate()
			.then(() => {
				logger.info("Database connection established successfully", {
					dbName: sequelize.getDatabaseName(),
					dialect: sequelize.getDialect(),
				});
			})
			.catch((error) => {
				logger.error("Failed to connect to database", { error });
			});
	}
	private initializeSyncDatabase(): void {
		if (process.env.NODE_ENV !== "development") {
			logger.info("Database sync skipped (not development environment)");
			return;
		}

		sequelize
			.sync()
			.then(() => {
				logger.info("Database synchronized successfully", {
					dbName: sequelize.getDatabaseName(),
					dialect: sequelize.getDialect(),
				});
			})
			.catch((error) => {
				logger.error("Failed to synchronize database", { error });
			});
	}

	public listen(): void {
		this.app.listen(this.port, () => {
			logger.info("Server started successfully", {
				port: this.port,
				environment: process.env.NODE_ENV,
				database: sequelize.getDatabaseName(),
			});
		});
	}

	public getServer(): Application {
		return this.app;
	}
}
