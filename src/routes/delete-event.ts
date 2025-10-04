import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const deleteEventRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		"/events/:id",
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

			const deletedEvents = await db
				.delete(schema.events)
				.where(and(eq(schema.events.id, id), eq(schema.events.userId, userId)))
				.returning();

			if (deletedEvents.length === 0) {
				return reply.status(404).send({ message: "Evento não encontrado" });
			}

			return reply.status(200).send({ message: "Evento deletado com sucesso" });
		},
	);
};
