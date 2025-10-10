import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { groupsController } from "../controller";

export const getGroupRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/",
		{ preHandler: authGuard },
		async (request: AuthenticatedRequest) => {
			const userId = request.user.id;
			const groups = await groupsController.get(userId);

			return groups;
		},
	);
};
