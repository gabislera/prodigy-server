import { and, eq, sql } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const updateTaskRoute: FastifyPluginAsyncZod = async (server) => {
	server.put(
		"/task/:id",
		{
			preHandler: authGuard, // protege a rota
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

			// Buscar a task e verificar se pertence ao usuário
			const currentTask = await db
				.select()
				.from(schema.tasks)
				.where(and(eq(schema.tasks.id, id), eq(schema.tasks.userId, userId)))
				.limit(1);

			if (currentTask.length === 0) {
				return reply.status(404).send({ message: "Task não encontrada" });
			}

			const task = currentTask[0];

			// Se o status completed mudou → reposiciona
			if (
				updateData.completed !== undefined &&
				updateData.completed !== task.completed
			) {
				const columnId = task.columnId;

				if (updateData.completed) {
					// completando → joga pro fim
					const maxPositionResult = await db
						.select({
							maxPosition: sql<number>`COALESCE(MAX(${schema.tasks.position}), 0)`,
						})
						.from(schema.tasks)
						.where(
							and(
								eq(schema.tasks.columnId, columnId),
								eq(schema.tasks.userId, userId),
							),
						);

					cleanUpdateData.position =
						(maxPositionResult[0]?.maxPosition || 0) + 1;
				} else {
					// reabrindo → joga pro topo
					await db
						.update(schema.tasks)
						.set({
							position: sql`${schema.tasks.position} + 1`,
							updatedAt: new Date(),
						})
						.where(
							and(
								eq(schema.tasks.columnId, columnId),
								eq(schema.tasks.completed, false),
								eq(schema.tasks.userId, userId),
							),
						);

					cleanUpdateData.position = 0;
				}
			}

			// Atualizar
			const updatedTasks = await db
				.update(schema.tasks)
				.set({
					...cleanUpdateData,
					updatedAt: new Date(),
				})
				.where(and(eq(schema.tasks.id, id), eq(schema.tasks.userId, userId)))
				.returning();

			if (updatedTasks.length === 0) {
				return reply.status(404).send({ message: "Task não encontrada" });
			}

			return reply.status(200).send(updatedTasks[0]);
		},
	);
};
