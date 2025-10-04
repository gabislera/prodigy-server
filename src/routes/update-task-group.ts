import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const updateTaskGroupRoute: FastifyPluginAsyncZod = async (server) => {
	server.put(
		"/task_group/:id",
		{
			preHandler: authGuard,
			schema: {
				params: z.object({
					id: z.string().uuid(),
				}),
				body: z.object({
					name: z.string().min(1).optional(),
					icon: z.string().min(1).optional(),
					color: z.string().min(1).optional(),
					bgColor: z.string().min(1).optional(),
				}),
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			const { id } = request.params;
			const updateData = request.body;

			const userId = request.user.id;

			// Remove undefined values
			const cleanUpdateData = Object.fromEntries(
				Object.entries(updateData).filter(([_, value]) => value !== undefined),
			);

			if (Object.keys(cleanUpdateData).length === 0) {
				return reply
					.status(400)
					.send({ message: "Nenhum campo para atualizar" });
			}

			const updatedGroups = await db
				.update(schema.taskGroups)
				.set({
					...cleanUpdateData,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(schema.taskGroups.id, id),
						eq(schema.taskGroups.userId, userId),
					),
				)
				.returning();

			if (updatedGroups.length === 0) {
				return reply.status(404).send({ message: "Grupo não encontrado" });
			}

			return reply.status(200).send(updatedGroups[0]);
		},
	);
};
