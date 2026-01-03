import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "users", paranoid: true, timestamps: true })
export class UserModel extends Model {
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
	})
	id!: string;

	@Column(DataType.STRING)
	name!: string;

	@Column(DataType.STRING)
	email!: string;
}
