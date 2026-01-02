import winston from "winston";
import { ENVS_APP } from "../config/envs.config";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
	let log = `${timestamp} [${level}]: ${message}`;

	if (Object.keys(metadata).length > 0) {
		log += ` ${JSON.stringify(metadata)}`;
	}

	if (stack) {
		log += `\n${stack}`;
	}

	return log;
});

const logger = winston.createLogger({
	level: ENVS_APP.IS_PRODUCTION ? "info" : "debug",
	format: combine(
		errors({ stack: true }),
		timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		ENVS_APP.IS_PRODUCTION ? winston.format.json() : combine(colorize(), logFormat)
	),
	transports: [
		new winston.transports.Console(),

		new winston.transports.File({
			filename: "logs/error.log",
			level: "error",
		}),
		new winston.transports.File({
			filename: "logs/combined.log",
		}),
	],
	exitOnError: false,
});

if (ENVS_APP.IS_PRODUCTION) {
	logger.format = combine(errors({ stack: true }), timestamp(), winston.format.json());
}

export default logger;
