import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserExportService } from "../services/user-export.service";
import { container } from "tsyringe";

const userService = container.resolve(UserService);
const userExportService = container.resolve(UserExportService);
export class UserController {
	async getAllUsers(req: Request, res: Response) {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const search = ((req.query.search as string) || "").trim() || undefined;

		if (page < 1 || limit < 1 || limit > 100) {
			res.status(400).json({
				success: false,
				message: "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100",
			});
			return;
		}

		const result = await userService.getUsersPaginated({ page, limit, search });
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

	async getUserById(req: Request, res: Response) {
		const { id } = req.params;
		const user = await userService.getById(id);
		res.json({ success: true, data: user });
	}

	async updateUser(req: Request, res: Response) {
		const { id } = req.params;
		const data = req.body;
		const user = await userService.update(id, data);
		res.json({ success: true, data: user });
	}

	async deleteUser(req: Request, res: Response) {
		const { id } = req.params;
		await userService.softDelete(id);
		res.json({ success: true, message: "User deleted successfully" });
	}

	async exportUsers(req: Request, res: Response) {
		const stream = await userExportService.exportUsersToCSV();
		
		res.setHeader("Content-Type", "text/csv; charset=utf-8");
		res.setHeader("Content-Disposition", `attachment; filename="users_${Date.now()}.csv"`);
		res.setHeader("Cache-Control", "public, max-age=300");
		
		stream.pipe(res);
	}
}
