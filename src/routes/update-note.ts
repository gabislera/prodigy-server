import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const updateNoteRoute: FastifyPluginAsyncZod = async (server) => {
	server.put(
		"/notes/:id",
		{
			preHandler: authGuard,
			schema: {
				params: z.object({
					id: z.string(),
				}),
				body: z.object({
					title: z.string().min(1),
					content: z.string().optional(),
				}),
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			const { title, content } = request.body;
			const { id } = request.params;

			const userId = request.user.id;

			const updatedNotes = await db
				.update(schema.notes)
				.set({ title, content })
				.where(and(eq(schema.notes.id, id), eq(schema.notes.userId, userId)))
				.returning();

			if (updatedNotes.length === 0) {
				return reply.status(404).send({ message: "Nota não encontrada" });
			}

			return reply.status(200).send(updatedNotes[0]);
		},
	);
};
