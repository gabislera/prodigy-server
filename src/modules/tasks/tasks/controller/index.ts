import { tasksRepository } from "../repository";
import type { CreateTaskSchema, UpdateTaskSchema } from "../schema";

export const tasksController = {
	async getAll(userId: string) {
		const tasks = await tasksRepository.getAll(userId);
		return tasks;
	},

	async create(userId: string, data: CreateTaskSchema) {
		const task = await tasksRepository.create(userId, data);
		if (!task) throw new Error("Erro ao criar tarefa");
		return task;
	},

	async delete(userId: string, id: string) {
		const deleted = await tasksRepository.delete(userId, id);
		if (!deleted) throw new Error("Task não encontrada");
		return deleted;
	},

	async update(userId: string, id: string, data: UpdateTaskSchema) {
		const task = await tasksRepository.update(userId, id, data);
		if (!task) throw new Error("Nota não encontrada");
		return task;
	},
};
