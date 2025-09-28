import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";

export const getNotesRoute: FastifyPluginAsyncZod = async (server) => {
	server.get("/notes", async () => {
		const results = await db
			.select({
				id: schema.notes.id,
				title: schema.notes.title,
				content: schema.notes.content,
				createdAt: schema.notes.createdAt,
				updatedAt: schema.notes.updatedAt,
			})
			.from(schema.notes)
			.orderBy(schema.notes.updatedAt);

		return results;
	});
};
