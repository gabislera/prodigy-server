import { columnsRepository } from "../repository";
import type { UpdateColumnOrderSchema } from "../schema";

export const columnsController = {
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
