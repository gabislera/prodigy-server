import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { columnsController } from "../controller";
import { updateColumnSchema } from "../schema";

export const updateColumnRoute: FastifyPluginAsyncZod = async (server) => {
	server.put(
		"/:id",
		{
			preHandler: authGuard,
			schema: {
				params: z.object({
					id: z.uuid(),
				}),
				body: updateColumnSchema,
			},
		},
		async (request: AuthenticatedRequest) => {
			const userId = request.user.id;
			const { id: columnId } = request.params;
			const { title } = request.body;

			const updatedColumn = await columnsController.update(
				userId,
				columnId,
				title,
			);

			return updatedColumn;
		},
	);
};
