import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const getNotesRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/notes",
		{ preHandler: authGuard },
		async (request: AuthenticatedRequest) => {
			const userId = request.user.id;

			const results = await db
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

			return results;
		},
	);
};
