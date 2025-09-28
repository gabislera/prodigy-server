import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const deleteNoteRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		"/notes/:id",
		{
			schema: {
				params: z.object({
					id: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { id } = request.params;

			const deletedNotes = await db
				.delete(schema.notes)
				.where(eq(schema.notes.id, id))
				.returning();

			if (deletedNotes.length === 0) {
				return reply.status(404).send({ message: "Nota não encontrada" });
			}

			return reply.status(200).send({ message: "Nota deletada com sucesso" });
		},
	);
};


