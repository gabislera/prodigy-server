import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";

export const getTaskGroupsRoute: FastifyPluginAsyncZod = async (server) => {
	server.get("/task_groups", async () => {
		const results = await db
			.select({
				id: schema.taskGroups.id,
				name: schema.taskGroups.name,
				icon: schema.taskGroups.icon,
				color: schema.taskGroups.color,
				bgColor: schema.taskGroups.bgColor,
				createdAt: schema.taskGroups.createdAt,
				updatedAt: schema.taskGroups.updatedAt,
				columnId: schema.taskColumns.id,
				columnTitle: schema.taskColumns.title,
				columnOrder: schema.taskColumns.order,
				taskId: schema.tasks.id,
				taskTitle: schema.tasks.title,
				taskDescription: schema.tasks.description,
				taskPriority: schema.tasks.priority,
				taskPosition: schema.tasks.position,
				taskCreatedAt: schema.tasks.createdAt,
				taskUpdatedAt: schema.tasks.updatedAt,
			})
			.from(schema.taskGroups)
			.leftJoin(
				schema.taskColumns,
				eq(schema.taskColumns.groupId, schema.taskGroups.id),
			)
			.leftJoin(schema.tasks, eq(schema.tasks.columnId, schema.taskColumns.id))
			.orderBy(
				schema.taskGroups.createdAt,
				schema.taskColumns.order,
				schema.tasks.position,
			);

		// Transform the flat results into hierarchical structure
		const groupsMap = new Map();

		for (const row of results) {
			if (!groupsMap.has(row.id)) {
				groupsMap.set(row.id, {
					id: row.id,
					name: row.name,
					icon: row.icon,
					color: row.color,
					bgColor: row.bgColor,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
					columns: [],
				});
			}

			if (row.columnId) {
				const group = groupsMap.get(row.id);
				let column = group.columns.find(
					(col: { id: string }) => col.id === row.columnId,
				);

				if (!column) {
					column = {
						id: row.columnId,
						title: row.columnTitle,
						groupId: row.id,
						order: row.columnOrder,
						tasks: [],
					};
					group.columns.push(column);
				}

				// Add task if it exists
				if (row.taskId) {
					column.tasks.push({
						id: row.taskId,
						title: row.taskTitle,
						description: row.taskDescription,
						priority: row.taskPriority,
						columnId: row.columnId,
						position: row.taskPosition,
						createdAt: row.taskCreatedAt,
						updatedAt: row.taskUpdatedAt,
					});
				}
			}
		}

		return Array.from(groupsMap.values());
	});
};
