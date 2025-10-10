import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { columnsController } from "../controller";

export const getColumnsRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/:id",
		{
			preHandler: authGuard,
			schema: {
				params: z.object({
					id: z.string(),
				}),
			},
		},
		async (request: AuthenticatedRequest) => {
			const userId = request.user.id;
			const { id: groupId } = request.params;
			const columns = await columnsController.get(userId, groupId);

			return columns;
		},
	);
};
