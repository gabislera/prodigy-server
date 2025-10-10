import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { columnsController } from "../controller";
import { updateColumnOrderSchema } from "../schema";

export const updateColumnsOrderRoute: FastifyPluginAsyncZod = async (
	server,
) => {
	server.put(
		"/:id/order",
		{
			preHandler: authGuard,
			schema: {
				params: z.object({
					id: z.uuid(),
				}),
				body: updateColumnOrderSchema,
			},
		},
		async (request: AuthenticatedRequest) => {
			const userId = request.user.id;
			const columnOrder = request.body;

			const updatedOrder = await columnsController.updateOrder(
				userId,
				columnOrder,
			);

			return updatedOrder;
		},
	);
};
