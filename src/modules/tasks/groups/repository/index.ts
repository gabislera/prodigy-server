import { and, eq, sql } from "drizzle-orm";
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

		// Criar colunas padrões para todos os grupos
		await columnsRepository.create(userId, group.id, "A Fazer", 0);
		await columnsRepository.create(userId, group.id, "Fazendo", 1);
		await columnsRepository.create(userId, group.id, "Concluído", 2);

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
				description: schema.taskGroups.description,
				createdAt: schema.taskGroups.createdAt,
				updatedAt: schema.taskGroups.updatedAt,
			})
			.from(schema.taskGroups)
			.where(eq(schema.taskGroups.userId, userId))
			.orderBy(schema.taskGroups.createdAt);

		// Adicionar contadores com query otimizada
		const groupsWithCounts = await Promise.all(
			groups.map(async (group) => {
				const [counts] = await db
					.select({
						taskCount: sql<number>`COUNT(DISTINCT ${schema.tasks.id})`,
						completedCount: sql<number>`COUNT(DISTINCT CASE WHEN ${schema.tasks.completed} = true THEN ${schema.tasks.id} END)`,
					})
					.from(schema.taskColumns)
					.leftJoin(
						schema.tasks,
						eq(schema.tasks.columnId, schema.taskColumns.id),
					)
					.where(eq(schema.taskColumns.groupId, group.id));

				return {
					...group,
					taskCount: counts?.taskCount || 0,
					completedCount: counts?.completedCount || 0,
				};
			}),
		);

		return groupsWithCounts;
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
				description: schema.taskGroups.description,
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

	async getStats(userId: string) {
		// Buscar todas as tasks do usuário diretamente pela tabela tasks
		const [result] = await db
			.select({
				totalTasks: sql<number>`COUNT(${schema.tasks.id})`,
				completedTasks: sql<number>`COUNT(CASE WHEN ${schema.tasks.completed} = true THEN 1 END)`,
				inProgressTasks: sql<number>`COUNT(CASE WHEN ${schema.tasks.completed} = false AND ${schema.tasks.columnId} IS NOT NULL THEN 1 END)`,
				todayTasks: sql<number>`COUNT(CASE WHEN DATE(${schema.tasks.startDate}) = CURRENT_DATE OR DATE(${schema.tasks.endDate}) = CURRENT_DATE THEN 1 END)`,
			})
			.from(schema.tasks)
			.where(eq(schema.tasks.userId, userId));

		const totalTasks = result?.totalTasks || 0;
		const completedTasks = result?.completedTasks || 0;
		const efficiency =
			totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

		return {
			totalTasks,
			completedTasks: completedTasks || 0,
			inProgressTasks: result?.inProgressTasks || 0,
			todayTasks: result?.todayTasks || 0,
			efficiency,
		};
	},
};
