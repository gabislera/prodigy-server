import { and, eq } from "drizzle-orm";
import { db } from "../../../../db/connection";
import { schema } from "../../../../db/schema";
import { columnsRepository } from "../../columns/repository";
import type { CreateGroupSchema, UpdateGroupSchema } from "../schema";

export const groupsRepository = {
	async create(userId: string, data: CreateGroupSchema) {
		const result = await db
			.insert(schema.taskGroups)
			.values({ userId, ...data })
			.returning();

		const group = result[0];

		// Não criar colunas padrões para o grupo Calendar
		if (group.name.toLowerCase() !== "calendar") {
			await columnsRepository.create(userId, group.id, "A Fazer", 0);
			await columnsRepository.create(userId, group.id, "Fazendo", 1);
			await columnsRepository.create(userId, group.id, "Concluído", 2);
		}

		return group;
	},

	async delete(userId: string, id: string) {
		const result = await db
			.delete(schema.taskGroups)
			.where(
				and(eq(schema.taskGroups.id, id), eq(schema.taskGroups.userId, userId)),
			)
			.returning();
		return result[0];
	},

	async get(userId: string) {
		const groups = await db
			.select({
				id: schema.taskGroups.id,
				name: schema.taskGroups.name,
				icon: schema.taskGroups.icon,
				color: schema.taskGroups.color,
				bgColor: schema.taskGroups.bgColor,
				createdAt: schema.taskGroups.createdAt,
				updatedAt: schema.taskGroups.updatedAt,
			})
			.from(schema.taskGroups)
			.where(eq(schema.taskGroups.userId, userId))
			.orderBy(schema.taskGroups.createdAt);

		return groups;
	},

	async update(userId: string, id: string, data: UpdateGroupSchema) {
		const cleanData = Object.fromEntries(
			Object.entries(data).filter(([_, value]) => value !== undefined),
		);

		if (Object.keys(cleanData).length === 0) return null;

		const [result] = await db
			.update(schema.taskGroups)
			.set({
				...cleanData,
				updatedAt: new Date(),
			})
			.where(
				and(eq(schema.taskGroups.id, id), eq(schema.taskGroups.userId, userId)),
			)
			.returning();

		return result;
	},

	async getWithDetails(userId: string) {
		// Buscar todos os grupos do usuário
		const groups = await db
			.select({
				id: schema.taskGroups.id,
				name: schema.taskGroups.name,
				icon: schema.taskGroups.icon,
				color: schema.taskGroups.color,
				bgColor: schema.taskGroups.bgColor,
				createdAt: schema.taskGroups.createdAt,
				updatedAt: schema.taskGroups.updatedAt,
			})
			.from(schema.taskGroups)
			.where(eq(schema.taskGroups.userId, userId))
			.orderBy(schema.taskGroups.createdAt);

		// Para cada grupo, buscar suas colunas e tasks
		const groupsWithDetails = await Promise.all(
			groups.map(async (group) => {
				const columns = await columnsRepository.getColumnsWithTasks(
					userId,
					group.id,
				);

				const taskCount = columns.reduce(
					(total, column) => total + column.tasks.length,
					0,
				);

				const completedCount = columns.reduce(
					(total, column) =>
						total + column.tasks.filter((task) => task.completed).length,
					0,
				);

				return {
					...group,
					columns,
					taskCount,
					completedCount,
				};
			}),
		);

		return groupsWithDetails;
	},
};
