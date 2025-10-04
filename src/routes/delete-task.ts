import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const deleteTaskRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		"/task/:id",
		{
			preHandler: authGuard,
			schema: {
				params: z.object({
					id: z.string().uuid(),
				}),
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			const { id } = request.params;

			const userId = request.user.id;

			const deletedTasks = await db
				.delete(schema.tasks)
				.where(and(eq(schema.tasks.id, id), eq(schema.tasks.userId, userId)))
				.returning();

			if (deletedTasks.length === 0) {
				return reply.status(404).send({ message: "Task não encontrada" });
			}

			return reply.status(200).send({ message: "Task deletada com sucesso" });
		},
	);
};
