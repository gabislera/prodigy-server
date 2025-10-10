import { and, eq, sql } from "drizzle-orm";
import { db } from "../../../../db/connection";
import { schema } from "../../../../db/schema";
import type { CreateTaskSchema, UpdateTaskSchema } from "../schema";

export const tasksRepository = {
	async create(userId: string, data: CreateTaskSchema) {
		const result = await db
			.insert(schema.items)
			.values({
				...data,
				userId,
				startDate: data.startDate ? new Date(data.startDate) : null,
				endDate: data.endDate ? new Date(data.endDate) : null,
			})
			.returning();

		return result[0];
	},

	async delete(userId: string, id: string) {
		const result = await db
			.delete(schema.items)
			.where(and(eq(schema.items.userId, userId), eq(schema.items.id, id)))
			.returning();
		return result[0];
	},

	async update(
		userId: string,
		id: string,
		updateData: Partial<UpdateTaskSchema>,
	) {
		// Remove undefined fields to avoid SQL errors
		const cleanUpdateData = Object.fromEntries(
			Object.entries(updateData).filter(([_, v]) => v !== undefined),
		);

		if (Object.keys(cleanUpdateData).length === 0) {
			throw new Error("No fields provided to update");
		}

		// Check if the task exists and belongs to the current user
		const currentTask = await db
			.select()
			.from(schema.items)
			.where(and(eq(schema.items.id, id), eq(schema.items.userId, userId)))
			.limit(1);

		if (currentTask.length === 0) {
			throw new Error("Task not found");
		}

		const task = currentTask[0];

		//  Handle automatic reordering when the "completed" status changes.
		//  - If completed → move to the bottom of the column
		//  - If reopened → move to the top of the column

		if (
			cleanUpdateData.completed !== undefined &&
			cleanUpdateData.completed !== task.completed
		) {
			const columnId = task.columnId;

			if (columnId) {
				if (cleanUpdateData.completed) {
					// When completing → move to the last position
					const [maxPositionResult] = await db
						.select({
							maxPosition: sql<number>`COALESCE(MAX(${schema.items.position}), 0)`,
						})
						.from(schema.items)
						.where(
							and(
								eq(schema.items.columnId, columnId),
								eq(schema.items.userId, userId),
							),
						);

					cleanUpdateData.position = (maxPositionResult?.maxPosition || 0) + 1;
				} else {
					// When reopening → push other open tasks down and place at the top
					await db
						.update(schema.items)
						.set({
							position: sql`${schema.items.position} + 1`,
							updatedAt: new Date(),
						})
						.where(
							and(
								eq(schema.items.columnId, columnId),
								eq(schema.items.completed, false),
								eq(schema.items.userId, userId),
							),
						);

					cleanUpdateData.position = 0;
				}
			}
		}

		// Update the task with new data
		const [updatedTask] = await db
			.update(schema.items)
			.set({
				...cleanUpdateData,
				updatedAt: new Date(),
			})
			.where(and(eq(schema.items.id, id), eq(schema.items.userId, userId)))
			.returning();

		if (!updatedTask) {
			throw new Error("Failed to update task");
		}

		return updatedTask;
	},
};
