import { and, eq } from "drizzle-orm";
import { db } from "../../../db/connection";
import { schema } from "../../../db/schema";

export const notesRepository = {
	async create(userId: string, data: { title: string; content?: string }) {
		const result = await db
			.insert(schema.notes)
			.values({ userId, ...data })
			.returning();
		return result[0];
	},

	async update(
		userId: string,
		id: string,
		data: { title: string; content?: string },
	) {
		const result = await db
			.update(schema.notes)
			.set(data)
			.where(and(eq(schema.notes.id, id), eq(schema.notes.userId, userId)))
			.returning();
		return result[0];
	},

	async delete(userId: string, id: string) {
		const result = await db
			.delete(schema.notes)
			.where(and(eq(schema.notes.id, id), eq(schema.notes.userId, userId)))
			.returning();
		return result[0];
	},

	async get(userId: string) {
		const result = await db
			.select({
				id: schema.notes.id,
				title: schema.notes.title,
				content: schema.notes.content,
				createdAt: schema.notes.createdAt,
				updatedAt: schema.notes.updatedAt,
			})
			.from(schema.notes)
			.where(eq(schema.notes.userId, userId))
			.orderBy(schema.notes.updatedAt);

		return result;
	},
};
