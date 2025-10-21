import { and, eq } from "drizzle-orm";
import { db } from "../../../../db/connection";
import { schema } from "../../../../db/schema";

interface TaskItem {
	id: string;
	title: string | null;
	description: string | null;
	priority: "high" | "medium" | "low" | null;
	columnId: string;
	position: number | null;
	completed: boolean | null;
	startDate: Date | null;
	endDate: Date | null;
	allDay: boolean | null;
	status: string | null;
	type: string | null;
	createdAt: Date | null;
	updatedAt: Date | null;
}

interface ColumnWithTasks {
	id: string;
	title: string;
	groupId: string;
	order: number;
	tasks: TaskItem[];
}

export const columnsRepository = {
	async create(userId: string, groupId: string, title: string, order: number) {
		const result = await db
			.insert(schema.taskColumns)
			.values({ userId, groupId, title, order })
			.returning();
		return result[0];
	},

	async updateOrder(userId: string, columnId: string, order: number) {
		const result = await db
			.update(schema.taskColumns)
			.set({
				order,
				updatedAt: new Date(),
			})
			.where(
				and(
					eq(schema.taskColumns.id, columnId),
					eq(schema.taskColumns.userId, userId),
				),
			)
			.returning();

		return result[0];
	},

	async update(userId: string, columnId: string, title: string) {
		const result = await db
			.update(schema.taskColumns)
			.set({
				title,
				updatedAt: new Date(),
			})
			.where(
				and(
					eq(schema.taskColumns.id, columnId),
					eq(schema.taskColumns.userId, userId),
				),
			)
			.returning();

		return result[0];
	},

	async delete(userId: string, columnId: string) {
		const result = await db
			.delete(schema.taskColumns)
			.where(
				and(
					eq(schema.taskColumns.id, columnId),
					eq(schema.taskColumns.userId, userId),
				),
			)
			.returning();

		return result[0];
	},

	// Fetch all columns (and their tasks) for a given group and user.
	// Returns a hierarchical structure: columns[] → tasks[]

	async getColumnsWithTasks(
		userId: string,
		groupId: string,
	): Promise<ColumnWithTasks[]> {
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
				taskStartDate: schema.tasks.startDate,
				taskEndDate: schema.tasks.endDate,
				taskAllDay: schema.tasks.allDay,
				taskStatus: schema.tasks.status,
				taskType: schema.tasks.type,
				taskCreatedAt: schema.tasks.createdAt,
				taskUpdatedAt: schema.tasks.updatedAt,
			})
			.from(schema.taskColumns)
			.leftJoin(schema.tasks, eq(schema.tasks.columnId, schema.taskColumns.id))
			.where(
				and(
					eq(schema.taskColumns.groupId, groupId),
					eq(schema.taskColumns.userId, userId),
				),
			)
			.orderBy(
				schema.taskColumns.order,
				schema.tasks.completed,
				schema.tasks.position,
			);

		const columnsMap = new Map<string, ColumnWithTasks>();

		for (const row of results) {
			if (!columnsMap.has(row.columnId)) {
				columnsMap.set(row.columnId, {
					id: row.columnId,
					title: row.columnTitle,
					groupId,
					order: row.columnOrder,
					tasks: [],
				});
			}

			if (row.taskId) {
				const column = columnsMap.get(row.columnId);
				if (column) {
					const task: TaskItem = {
						id: row.taskId,
						title: row.taskTitle,
						description: row.taskDescription,
						priority: row.taskPriority as "high" | "medium" | "low" | null,
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
					};
					column.tasks.push(task);
				}
			}
		}

		return Array.from(columnsMap.values());
	},
};
