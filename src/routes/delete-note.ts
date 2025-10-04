import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const deleteNoteRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		"/notes/:id",
		{
			preHandler: authGuard,
			schema: {
				params: z.object({
					id: z.string(),
				}),
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			const { id } = request.params;

			const userId = request.user.id;

			const deletedNotes = await db
				.delete(schema.notes)
				.where(and(eq(schema.notes.id, id), eq(schema.notes.userId, userId)))
				.returning();

			if (deletedNotes.length === 0) {
				return reply.status(404).send({ message: "Nota não encontrada" });
			}

			return reply.status(200).send({ message: "Nota deletada com sucesso" });
		},
	);
};
