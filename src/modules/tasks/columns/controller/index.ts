import { columnsRepository } from "../repository";
import type { UpdateColumnOrderSchema } from "../schema";

interface CreateColumnData {
	groupId: string;
	title: string;
	order: number;
}

export const columnsController = {
	async create(userId: string, data: CreateColumnData) {
		const column = await columnsRepository.create(
			userId,
			data.groupId,
			data.title,
			data.order,
		);
		if (!column) throw new Error("Erro ao criar coluna");
		return column;
	},

	async get(userId: string, groupId: string) {
		const columns = await columnsRepository.getColumnsWithTasks(
			userId,
			groupId,
		);
		if (!columns) throw new Error("Columns not found");
		return columns;
	},

	async updateOrder(userId: string, data: UpdateColumnOrderSchema) {
		const updated = await columnsRepository.updateOrder(
			userId,
			data.columnId,
			data.order,
		);

		if (!updated) throw new Error("Column not found or not updated");
		return updated;
	},
};
