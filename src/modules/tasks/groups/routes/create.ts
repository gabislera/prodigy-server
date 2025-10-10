import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { groupsController } from "../controller";
import { createGroupSchema } from "../schema";

export const createGroupRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/",
		{
			preHandler: authGuard,
			schema: {
				body: createGroupSchema,
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			const userId = request.user.id;
			const group = await groupsController.create(userId, request.body);
			return reply.status(201).send(group);
		},
	);
};
