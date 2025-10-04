import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const getTaskGroupsRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/task_groups",
		{ preHandler: authGuard },
		async (request: AuthenticatedRequest) => {
			const userId = request.user.id;

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
	);
};
