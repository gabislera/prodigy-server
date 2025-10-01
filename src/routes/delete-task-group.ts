import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";

export const deleteTaskGroupRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		"/task_group/:id",
		{
			schema: {
				params: z.object({
					id: z.string().uuid(),
				}),
			},
		},
		async (request, reply) => {
			const { id } = request.params;

			const deletedGroups = await db
				.delete(schema.taskGroups)
				.where(eq(schema.taskGroups.id, id))
				.returning();

			if (deletedGroups.length === 0) {
				return reply.status(404).send({ message: "Grupo não encontrado" });
			}

			return reply.status(200).send({ message: "Grupo deletado com sucesso" });
		},
	);
};
