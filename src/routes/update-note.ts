import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const updateNoteRoute: FastifyPluginAsyncZod = async (server) => {
	server.put(
		"/notes/:id",
		{
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
		async (request, reply) => {
			const { title, content } = request.body;
			const { id } = request.params;

			const updatedNotes = await db
				.update(schema.notes)
				.set({ title, content })
				.where(eq(schema.notes.id, id))
				.returning();

			if (updatedNotes.length === 0) {
				return reply.status(404).send({ message: "Nota não encontrada" });
			}

			return reply.status(200).send(updatedNotes[0]);
		},
	);
};
