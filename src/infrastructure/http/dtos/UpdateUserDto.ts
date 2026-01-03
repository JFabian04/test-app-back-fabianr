import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
	@IsOptional()
	@IsString({ message: "Name must be a string" })
	@MinLength(2, { message: "Name must be at least 2 characters long" })
	name?: string;

	@IsOptional()
	@IsEmail({}, { message: "Email must be a valid email address" })
	email?: string;
}
