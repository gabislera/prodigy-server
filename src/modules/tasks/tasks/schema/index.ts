import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { tasks } from "../../../../db/schema/tasks";

const baseTaskSchema = createInsertSchema(tasks).omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
});

export const createTaskSchema = baseTaskSchema.extend({
	title: z.string().min(1, "Título obrigatório"),
	description: z.string().optional(),
	priority: z.enum(["high", "medium", "low"]),
	type: z.enum(["task", "event"]).default("task"),
	columnId: z.uuid("columnId inválido").nullable().optional(),
	position: z.number().nonnegative(),
	completed: z.boolean().default(false),
	startDate: z.string().optional().nullable(),
	endDate: z.string().optional().nullable(),
	groupId: z.uuid().optional(),
	allDay: z.boolean().optional(),
	status: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskParamsSchema = z.object({
	id: z.uuid(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type TaskParams = z.infer<typeof taskParamsSchema>;
