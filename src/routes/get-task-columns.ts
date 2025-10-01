import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";

export const getTaskColumnsRoute: FastifyPluginAsyncZod = async (server) => {
	server.get("/task_groups/:id/columns", async (request) => {
		const { id } = request.params as { id: string };

		const results = await db
			.select({
				columnId: schema.taskColumns.id,
				columnTitle: schema.taskColumns.title,
				columnOrder: schema.taskColumns.order,
				taskId: schema.tasks.id,
				taskTitle: schema.tasks.title,
				taskDescription: schema.tasks.description,
				taskPriority: schema.tasks.priority,
				taskPosition: schema.tasks.position,
				taskCompleted: schema.tasks.completed,
				taskCreatedAt: schema.tasks.createdAt,
				taskUpdatedAt: schema.tasks.updatedAt,
			})
			.from(schema.taskColumns)
			.leftJoin(schema.tasks, eq(schema.tasks.columnId, schema.taskColumns.id))
			.where(eq(schema.taskColumns.groupId, id))
			.orderBy(
				schema.taskColumns.order,
				schema.tasks.completed,
				schema.tasks.position,
			);

		// transforma em estrutura hierárquica
		const columnsMap = new Map();

		for (const row of results) {
			if (!columnsMap.has(row.columnId)) {
				columnsMap.set(row.columnId, {
					id: row.columnId,
					title: row.columnTitle,
					groupId: id,
					order: row.columnOrder,
					tasks: [],
				});
			}

			if (row.taskId) {
				columnsMap.get(row.columnId).tasks.push({
					id: row.taskId,
					title: row.taskTitle,
					description: row.taskDescription,
					priority: row.taskPriority,
					columnId: row.columnId,
					position: row.taskPosition,
					completed: row.taskCompleted,
					createdAt: row.taskCreatedAt,
					updatedAt: row.taskUpdatedAt,
				});
			}
		}

		return Array.from(columnsMap.values());
	});
};
