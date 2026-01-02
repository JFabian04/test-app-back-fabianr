import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

const env = process.env.NODE_ENV || "development";

dotenv.config({
	path: path.resolve(__dirname, `../../.env.${env}`),
});

const envSchema = z.object({
	DB_HOST: z.string().min(1, "DB_HOST is required"),
	DB_PORT: z.string().regex(/^\d+$/, "DB_PORT must be a number"),
	DB_USER: z.string().min(1, "DB_USER is required"),
	DB_PASSWORD: z.string().default(""),
	DB_NAME: z.string().min(1, "DB_NAME is required"),
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});


const validateEnv = () => {
	try {
		return envSchema.parse({
			DB_HOST: process.env.DB_HOST,
			DB_PORT: process.env.DB_PORT,
			DB_USER: process.env.DB_USER,
			DB_PASSWORD: process.env.DB_PASSWORD,
			DB_NAME: process.env.DB_NAME,
			NODE_ENV: process.env.NODE_ENV,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errors = error.issues.map((err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`);
			throw new Error(`Invalid environment variables:\n${errors.join("\n")}`);
		}
		throw error;
	}
};

const validatedEnv = validateEnv();

export const ENVS_DB = {
	DB_HOST: validatedEnv.DB_HOST,
	DB_PORT: validatedEnv.DB_PORT,
	DB_USER: validatedEnv.DB_USER,
	DB_PASSWORD: validatedEnv.DB_PASSWORD,
	DB_NAME: validatedEnv.DB_NAME,
};

export const ENVS_APP = {
	IS_PRODUCTION: validatedEnv.NODE_ENV === "production",
	NODE_ENV: validatedEnv.NODE_ENV,
};
