import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { tasksController } from "../controller";
import { taskParamsSchema } from "../schema";

export const deleteTaskRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/:id",
		{
			preHandler: authGuard,
			schema: { params: taskParamsSchema },
		},
		async (request: AuthenticatedRequest, reply) => {
			const userId = request.user.id;
			const { id } = request.params;
			await tasksController.delete(userId, id);
			return reply.status(200).send({ message: "Task deletada com sucesso" });
		},
	);
};
