import { and, eq } from "drizzle-orm";
import { db } from "../../../db/connection";
import { schema } from "../../../db/schema";

export const authRepository = {
	async findUserByEmail(email: string) {
		return await db.query.users.findFirst({
			where: eq(schema.users.email, email),
		});
	},

	async findUserById(userId: string) {
		return await db.query.users.findFirst({
			where: eq(schema.users.id, userId),
		});
	},

	async createUser(data: { name: string; email: string; passwordHash: string }) {
		const result = await db
			.insert(schema.users)
			.values(data)
			.returning();
		return result[0];
	},

	async updateUser(userId: string, data: { name?: string; email?: string }) {
		const result = await db
			.update(schema.users)
			.set(data)
			.where(eq(schema.users.id, userId))
			.returning({
				id: schema.users.id,
				name: schema.users.name,
				email: schema.users.email,
				createdAt: schema.users.createdAt,
				updatedAt: schema.users.updatedAt,
			});
		return result[0];
	},

	async createSession(data: {
		userId: string;
		sessionToken: string;
		expiresAt: Date;
	}) {
		const result = await db
			.insert(schema.sessions)
			.values(data)
			.returning();
		return result[0];
	},

	async findSession(sessionToken: string) {
		return await db.query.sessions.findFirst({
			where: eq(schema.sessions.sessionToken, sessionToken),
		});
	},

	async deleteSession(sessionToken: string) {
		const result = await db
			.delete(schema.sessions)
			.where(eq(schema.sessions.sessionToken, sessionToken))
			.returning();
		return result[0];
	},
};
