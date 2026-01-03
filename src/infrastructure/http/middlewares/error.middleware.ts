import { Request, Response, NextFunction } from "express";
import { HttpException } from "../errors/HttpException";
import { UserAlreadyExistsError } from "../../../domain/errors/UserAlreadyExistsError";
import logger from "../../../utils/logger";

export function errorHandler(err: Error | HttpException, req: Request, res: Response, next: NextFunction): void {
	logger.error("Error handled", {
		error: err.message,
		stack: err.stack,
		path: req.path,
		method: req.method,
	});

	if (err instanceof UserAlreadyExistsError) {
		res.status(409).json({
			success: false,
			errorCode: "USER_ALREADY_EXISTS",
			error: {
				message: err.message,
			},
		});
		return;
	}

	const isHttpException = (error: any): error is HttpException => {
		return error instanceof HttpException;
	};

	const status = err instanceof HttpException ? err.status : 500;
	const message = err.message || "Internal Server Error";
	const errorCode = isHttpException(err) && err.errorCode ? err.errorCode : "UNKNOWN_ERROR";

	res.status(status).json({
		success: false,
		errorCode: errorCode,
		error: {
			message,
		},
	});
}
