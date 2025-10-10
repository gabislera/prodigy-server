import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { groupsController } from "../controller";

export const deleteGroupRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		"/:id",
		{
			preHandler: authGuard,
			schema: {
				params: z.object({
					id: z.string(),
				}),
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			const userId = request.user.id;
			const { id } = request.params;
			await groupsController.delete(userId, id);
			return reply.status(200).send({ message: "Grupo deletado com sucesso" });
		},
	);
};
