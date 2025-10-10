import { groupsRepository } from "../repository";
import type { CreateGroupSchema, UpdateGroupSchema } from "../schema";

export const groupsController = {
	async create(userId: string, data: CreateGroupSchema) {
		const group = await groupsRepository.create(userId, data);
		if (!group) throw new Error("Erro ao criar grupo");
		return group;
	},

	async delete(userId: string, id: string) {
		const group = await groupsRepository.delete(userId, id);
		if (!group) throw new Error("Erro ao deletar grupo");
		return group;
	},

	async get(userId: string) {
		const groups = await groupsRepository.get(userId);
		if (!groups) throw new Error("Erro ao buscar grupos");
		return groups;
	},

	async update(userId: string, id: string, data: UpdateGroupSchema) {
		const group = await groupsRepository.update(userId, id, data);
		return group;
	},
};
