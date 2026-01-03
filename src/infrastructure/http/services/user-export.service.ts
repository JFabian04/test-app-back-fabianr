import { injectable, inject } from "tsyringe";
import { UserRepository } from "../../../domain/ports/UserRepository";
import { User } from "../../../domain/entities/User";
import { createObjectCsvStringifier } from "csv-writer";
import { Readable } from "stream";

@injectable()
export class UserExportService {
	constructor(
		@inject("UserRepository")
		private readonly userRepository: UserRepository
	) {}

	async exportUsersToCSV(): Promise<Readable> {
		const BATCH_SIZE = 500;
		let page = 1;
		let hasMore = true;

		const csvStringifier = createObjectCsvStringifier({
			header: [
				{ id: "id", title: "ID" },
				{ id: "name", title: "Name" },
				{ id: "email", title: "Email" },
				{ id: "createdAt", title: "Created At" },
			],
		});

		const userRepository = this.userRepository;

		const stream = new Readable({
			async read() {
				if (!hasMore) {
					this.push(null);
					return;
				}

				try {
					const result = await userRepository.findAllPaginated({
						page,
						limit: BATCH_SIZE,
					});

					if (page === 1) {
						this.push(csvStringifier.getHeaderString());
					}

					const records = result.data.map((user: User) => ({
						id: user.id,
						name: user.name,
						email: user.email,
						createdAt: new Date().toISOString(),
					}));

					this.push(csvStringifier.stringifyRecords(records));

					hasMore = page < result.pagination.totalPages;
					page++;
				} catch (error) {
					this.destroy(error as Error);
				}
			},
		});

		return stream;
	}
}
