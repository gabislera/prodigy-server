import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";

export const updateTaskRoute: FastifyPluginAsyncZod = async (server) => {
	server.put(
		"/task/:id",
		{
			schema: {
				params: z.object({
					id: z.string().uuid(),
				}),
				body: z.object({
					title: z.string().min(1).optional(),
					description: z.string().optional(),
					priority: z.enum(["high", "medium", "low"]).optional(),
					columnId: z.string().uuid().optional(),
					position: z.number().optional(),
					completed: z.boolean().optional(),
				}),
			},
		},
		async (request, reply) => {
			const { id } = request.params;
			const updateData = request.body;

			// Remove undefined values
			const cleanUpdateData = Object.fromEntries(
				Object.entries(updateData).filter(([_, value]) => value !== undefined),
			);

			if (Object.keys(cleanUpdateData).length === 0) {
				return reply
					.status(400)
					.send({ message: "Nenhum campo para atualizar" });
			}

			const updatedTasks = await db
				.update(schema.tasks)
				.set({
					...cleanUpdateData,
					updatedAt: new Date(),
				})
				.where(eq(schema.tasks.id, id))
				.returning();

			if (updatedTasks.length === 0) {
				return reply.status(404).send({ message: "Task não encontrada" });
			}

			return reply.status(200).send(updatedTasks[0]);
		},
	);
};
