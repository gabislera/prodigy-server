import { and, eq, sql } from "drizzle-orm";
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

			// Get the current task to check its current state
			const currentTask = await db
				.select()
				.from(schema.tasks)
				.where(eq(schema.tasks.id, id))
				.limit(1);

			if (currentTask.length === 0) {
				return reply.status(404).send({ message: "Task não encontrada" });
			}

			const task = currentTask[0];

			// If the completed status is being changed, we need to reorder tasks
			if (
				updateData.completed !== undefined &&
				updateData.completed !== task.completed
			) {
				const isCompleting = updateData.completed === true;
				const columnId = task.columnId;

				if (isCompleting) {
					// When completing a task, move it to the end (highest position)
					// Get the current max position in the column
					const maxPositionResult = await db
						.select({
							maxPosition: sql<number>`COALESCE(MAX(${schema.tasks.position}), 0)`,
						})
						.from(schema.tasks)
						.where(eq(schema.tasks.columnId, columnId));

					const newPosition = (maxPositionResult[0]?.maxPosition || 0) + 1;
					cleanUpdateData.position = newPosition;
				} else {
					// When uncompleting a task, move it to the beginning (position 0)
					// First, increment all other tasks' positions by 1
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
							),
						);

					cleanUpdateData.position = 0;
				}
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
