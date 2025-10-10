import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const getTaskColumnsRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/task_groups/:id/columns",
		{ preHandler: authGuard },
		async (request: AuthenticatedRequest) => {
			const { id } = request.params as { id: string };

			const userId = request.user.id;

			const results = await db
				.select({
					columnId: schema.taskColumns.id,
					columnTitle: schema.taskColumns.title,
					columnOrder: schema.taskColumns.order,
					taskId: schema.items.id,
					taskTitle: schema.items.title,
					taskDescription: schema.items.description,
					taskPriority: schema.items.priority,
					taskPosition: schema.items.position,
					taskCompleted: schema.items.completed,
					taskStartDate: schema.items.startDate,
					taskEndDate: schema.items.endDate,
					taskAllDay: schema.items.allDay,
					taskStatus: schema.items.status,
					taskType: schema.items.type,
					taskCreatedAt: schema.items.createdAt,
					taskUpdatedAt: schema.items.updatedAt,
				})
				.from(schema.taskColumns)
				.leftJoin(
					schema.items,
					eq(schema.items.columnId, schema.taskColumns.id),
				)
				.where(
					and(
						eq(schema.taskColumns.groupId, id),
						eq(schema.taskColumns.userId, userId),
					),
				)
				.orderBy(
					schema.taskColumns.order,
					schema.items.completed,
					schema.items.position,
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
						startDate: row.taskStartDate,
						endDate: row.taskEndDate,
						allDay: row.taskAllDay,
						status: row.taskStatus,
						type: row.taskType,
						createdAt: row.taskCreatedAt,
						updatedAt: row.taskUpdatedAt,
					});
				}
			}

			return Array.from(columnsMap.values());
		},
	);
};
