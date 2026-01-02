import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { container } from "tsyringe";

const userService = container.resolve(UserService);
export class UserController {
	async getAllUsers(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;

		if (page < 1 || limit < 1 || limit > 100) {
			res.status(400).json({
				success: false,
				message: "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100",
			});
			return;
		}

		const result = await userService.getUsersPaginated({ page, limit });
		res.json({
			success: true,
			...result,
		});
	}
	async createUser(req: Request, res: Response) {
		const { name, email } = req.body;
		const user = await userService.create({
			name,
			email,
		});
		res.status(201).json({ ok: true, user });
	}
}
