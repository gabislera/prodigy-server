import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";

export const getTaskGroupsRoute: FastifyPluginAsyncZod = async (server) => {
	server.get("/task_groups", async () => {
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
			.orderBy(schema.taskGroups.createdAt);

		return groups;
	});
};
