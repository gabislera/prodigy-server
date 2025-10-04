import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const createTaskGroupRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/task_group",
		{
			preHandler: authGuard,
			schema: {
				body: z.object({
					name: z.string().min(1),
					icon: z.string().min(1),
					color: z.string().min(1),
					bgColor: z.string().min(1),
				}),
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			const { name, icon, color, bgColor } = request.body;

			const userId = request.user.id;

			const result = await db
				.insert(schema.taskGroups)
				.values({ userId, name, icon, color, bgColor })
				.returning();

			const insertedGroup = result[0];

			if (!insertedGroup) {
				throw new Error("Failed to create new group");
			}

			const columns = await db
				.insert(schema.taskColumns)
				.values([
					{ userId, title: "A Fazer", groupId: insertedGroup.id, order: 1 },
					{ userId, title: "Fazendo", groupId: insertedGroup.id, order: 2 },
					{ userId, title: "Completa", groupId: insertedGroup.id, order: 3 },
				])
				.returning();

			const newGroup = {
				...insertedGroup,
				columns,
			};

			return reply.status(201).send(newGroup);
		},
	);
};
