import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { groupsController } from "../controller";

export const getGroupWithDetailsRoute: FastifyPluginAsyncZod = async (
	server,
) => {
	server.get(
		"/with-details",
		{ preHandler: authGuard },
		async (request: AuthenticatedRequest) => {
			const userId = request.user.id;
			const groups = await groupsController.getWithDetails(userId);

			return groups;
		},
	);
};
