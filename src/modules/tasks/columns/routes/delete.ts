import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { columnsController } from "../controller";

export const deleteColumnRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		"/:id",
		{
			preHandler: authGuard,
			schema: {
				params: z.object({
					id: z.uuid(),
				}),
			},
		},
		async (request: AuthenticatedRequest) => {
			const userId = request.user.id;
			const { id: columnId } = request.params;

			const deletedColumn = await columnsController.delete(userId, columnId);

			return deletedColumn;
		},
	);
};
