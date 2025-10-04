import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const deleteTaskGroupRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		"/task_group/:id",
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

			const deletedGroups = await db
				.delete(schema.taskGroups)
				.where(
					and(
						eq(schema.taskGroups.id, id),
						eq(schema.taskGroups.userId, userId),
					),
				)
				.returning();

			if (deletedGroups.length === 0) {
				return reply.status(404).send({ message: "Grupo não encontrado" });
			}

			return reply.status(200).send({ message: "Grupo deletado com sucesso" });
		},
	);
};
