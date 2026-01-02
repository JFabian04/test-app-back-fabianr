import { Request, Response, NextFunction } from "express";
import { HttpException } from "../errors/HttpException";
import logger from "../../../utils/logger";

export function errorHandler(err: Error | HttpException, req: Request, res: Response, next: NextFunction): void {
	logger.error("Error handled", {
		error: err.message,
		stack: err.stack,
		path: req.path,
		method: req.method,
	});

	const status = err instanceof HttpException ? err.status : 500;
	const message = err.message || "Internal Server Error";

	res.status(status).json({
		success: false,
		error: {
			message,
		},
	});
}
