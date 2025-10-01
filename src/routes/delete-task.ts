import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";

export const deleteTaskRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		"/task/:id",
		{
			schema: {
				params: z.object({
					id: z.string().uuid(),
				}),
			},
		},
		async (request, reply) => {
			const { id } = request.params;

			const deletedTasks = await db
				.delete(schema.tasks)
				.where(eq(schema.tasks.id, id))
				.returning();

			if (deletedTasks.length === 0) {
				return reply.status(404).send({ message: "Task não encontrada" });
			}

			return reply.status(200).send({ message: "Task deletada com sucesso" });
		},
	);
};
