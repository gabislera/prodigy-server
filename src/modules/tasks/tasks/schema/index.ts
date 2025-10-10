import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { items } from "../../../../db/schema/tasks";

const baseTaskSchema = createInsertSchema(items).omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
});

export const createTaskSchema = baseTaskSchema.extend({
	title: z.string().min(1, "Título obrigatório"),
	description: z.string().optional(),
	priority: z.enum(["high", "medium", "low"]),
	columnId: z.uuid("columnId inválido"),
	position: z.number().nonnegative(),
	completed: z.boolean().default(false),
	startDate: z.string().nullable().optional(),
	endDate: z.string().nullable().optional(),
	groupId: z.uuid().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskParamsSchema = z.object({
	id: z.uuid(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type TaskParams = z.infer<typeof taskParamsSchema>;
