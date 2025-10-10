import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { taskGroups } from "../../../../db/schema/tasks";

const baseGroupSchema = createInsertSchema(taskGroups).omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
});

export const createGroupSchema = baseGroupSchema.extend({
	name: z.string().min(1, "Nome obrigatório"),
	icon: z.string().min(1, "Ícone obrigatório"),
	color: z.string().min(1, "Cor obrigatória"),
	bgColor: z.string().min(1, "Cor de fundo obrigatória"),
});

export const updateGroupSchema = createGroupSchema.partial();

export const groupParamsSchema = z.object({
	id: z.uuid(),
});

export type CreateGroupSchema = z.infer<typeof createGroupSchema>;
export type UpdateGroupSchema = z.infer<typeof updateGroupSchema>;
export type GroupParams = z.infer<typeof groupParamsSchema>;
