import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { tasksController } from "../controller";

export const getTasksRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/",
		{ preHandler: authGuard },
		async (request: AuthenticatedRequest) => {
			const userId = request.user.id;
			const tasks = await tasksController.getAll(userId);

			return tasks;
		},
	);
};
