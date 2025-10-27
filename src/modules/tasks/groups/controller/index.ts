import { groupsRepository } from "../repository";
import type { CreateGroupSchema, UpdateGroupSchema } from "../schema";

export const groupsController = {
	async create(userId: string, data: CreateGroupSchema) {
		const group = await groupsRepository.create(userId, data);
		if (!group) throw new Error("Error creating group");
		return group;
	},

	async delete(userId: string, id: string) {
		const group = await groupsRepository.delete(userId, id);
		if (!group) throw new Error("Error deleting group");
		return group;
	},

	async get(userId: string) {
		const groups = await groupsRepository.get(userId);
		if (!groups) throw new Error("Error getting groups");
		return groups;
	},

	async update(userId: string, id: string, data: UpdateGroupSchema) {
		const group = await groupsRepository.update(userId, id, data);
		return group;
	},

	async getWithDetails(userId: string) {
		const groups = await groupsRepository.getWithDetails(userId);
		if (!groups) throw new Error("Error getting groups with details");
		return groups;
	},

	async getStats(userId: string) {
		const stats = await groupsRepository.getStats(userId);
		return stats;
	},
};
