import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const deleteEventRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		"/events/:id",
		{
			schema: {
				params: z.object({
					id: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { id } = request.params;

			const deletedEvents = await db
				.delete(schema.events)
				.where(eq(schema.events.id, id))
				.returning();

			if (deletedEvents.length === 0) {
				return reply.status(404).send({ message: "Evento não encontrado" });
			}

			return reply.status(200).send({ message: "Evento deletado com sucesso" });
		},
	);
};
