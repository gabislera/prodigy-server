import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { columnsController } from "../controller";
import { createColumnSchema } from "../schema";

export const createColumnRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/",
		{
			preHandler: authGuard,
			schema: {
				body: createColumnSchema,
			},
		},
		async (request: AuthenticatedRequest) => {
			const userId = request.user.id;
			const data = request.body;

			const column = await columnsController.create(userId, data);

			return column;
		},
	);
};
