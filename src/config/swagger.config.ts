import swaggerJsdoc from "swagger-jsdoc";
import { ENVS_APP } from "./envs.config";

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Hexagonal Express API",
			version: "1.0.0",
			description: "REST API with hexagonal architecture using Express and TypeScript",
			contact: {
				name: "API Support",
			},
		},
		servers: [
			{
				url: `http://localhost:${process.env.PORT || 3000}`,
				description: ENVS_APP.IS_PRODUCTION ? "Production server" : "Development server",
			},
		],
		components: {
			schemas: {
				User: {
					type: "object",
					required: ["name", "email"],
					properties: {
						id: {
							type: "string",
							format: "uuid",
							description: "User unique identifier",
						},
						name: {
							type: "string",
							minLength: 2,
							description: "User full name",
							example: "John Doe",
						},
						email: {
							type: "string",
							format: "email",
							description: "User email address",
							example: "john.doe@example.com",
						},
					},
				},
				CreateUserDto: {
					type: "object",
					required: ["name", "email"],
					properties: {
						name: {
							type: "string",
							minLength: 2,
							description: "User full name",
							example: "John Doe",
						},
						email: {
							type: "string",
							format: "email",
							description: "User email address",
							example: "john.doe@example.com",
						},
					},
				},
				PaginatedUsers: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: true,
						},
						data: {
							type: "array",
							items: {
								$ref: "#/components/schemas/User",
							},
						},
						pagination: {
							type: "object",
							properties: {
								page: {
									type: "integer",
									example: 1,
								},
								limit: {
									type: "integer",
									example: 10,
								},
								total: {
									type: "integer",
									example: 100,
								},
								totalPages: {
									type: "integer",
									example: 10,
								},
							},
						},
					},
				},
				Error: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: false,
						},
						error: {
							type: "object",
							properties: {
								message: {
									type: "string",
									example: "Error message",
								},
							},
						},
					},
				},
				ValidationError: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: false,
						},
						message: {
							type: "string",
							example: "Validation failed",
						},
						errors: {
							type: "array",
							items: {
								type: "object",
								properties: {
									field: {
										type: "string",
										example: "email",
									},
									errors: {
										type: "array",
										items: {
											type: "string",
										},
										example: ["Email must be a valid email address"],
									},
								},
							},
						},
					},
				},
			},
		},
	},
	apis: ["./src/infrastructure/http/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
