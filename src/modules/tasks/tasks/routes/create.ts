import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { tasksController } from "../controller";
import { createTaskSchema } from "../schema";

export const createTaskRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/",
		{
			preHandler: authGuard,
			schema: { body: createTaskSchema },
		},
		async (request: AuthenticatedRequest, reply) => {
			const userId = request.user.id;
			const task = await tasksController.create(userId, request.body);
			return reply.status(201).send(task);
		},
	);
};
