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
		if (!column) throw new Error("Error creating column");
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

	async update(userId: string, columnId: string, title: string) {
		const updated = await columnsRepository.update(userId, columnId, title);

		if (!updated) throw new Error("Column not found or not updated");
		return updated;
	},

	async delete(userId: string, columnId: string) {
		const deleted = await columnsRepository.delete(userId, columnId);

		if (!deleted) throw new Error("Column not found or not deleted");
		return deleted;
	},
};
