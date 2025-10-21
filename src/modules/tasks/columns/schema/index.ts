import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { taskColumns } from "../../../../db/schema/tasks";

const baseColumnSchema = createInsertSchema(taskColumns).omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
});

export const createColumnSchema = baseColumnSchema
	.extend({
		title: z.string().min(1, "Título obrigatório"),
		order: z.number().nonnegative(),
		groupId: z.uuid("Group ID inválido"),
	})
	.strict();

export const updateColumnOrderSchema = z
	.object({
		columnId: z.uuid("Column ID inválido"),
		order: z.number(),
	})
	.strict();

export const updateColumnSchema = z
	.object({
		title: z.string().min(1, "Título obrigatório"),
	})
	.strict();

export type CreateColumnSchema = z.infer<typeof createColumnSchema>;
export type UpdateColumnOrderSchema = z.infer<typeof updateColumnOrderSchema>;
export type UpdateColumnSchema = z.infer<typeof updateColumnSchema>;
