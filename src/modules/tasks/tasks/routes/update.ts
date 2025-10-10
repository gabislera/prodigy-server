import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { tasksController } from "../controller";
import { taskParamsSchema, updateTaskSchema } from "../schema";

export const updateTaskRoute: FastifyPluginAsyncZod = async (server) => {
	server.put(
		"/:id",
		{
			preHandler: authGuard,
			schema: {
				params: taskParamsSchema,
				body: updateTaskSchema,
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			const userId = request.user.id;
			const { id } = request.params;
			const note = await tasksController.update(userId, id, request.body);
			return reply.status(200).send(note);
		},
	);
};
