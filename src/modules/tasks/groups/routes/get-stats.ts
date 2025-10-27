import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { groupsController } from "../controller";

export const getStatsRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/stats",
		{
			preHandler: authGuard,
		},
		async (request: AuthenticatedRequest, reply) => {
			const userId = request.user.id;
			const stats = await groupsController.getStats(userId);
			return reply.status(200).send(stats);
		},
	);
};
