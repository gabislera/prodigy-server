import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { groupsController } from "../controller";
import { updateGroupSchema } from "../schema";

export const updateGroupRoute: FastifyPluginAsyncZod = async (server) => {
	server.put(
		"/:id",
		{
			preHandler: authGuard,
			schema: updateGroupSchema,
		},
		async (request: AuthenticatedRequest, reply) => {
			const userId = request.user.id;
			const { id } = request.params;
			const note = await groupsController.update(userId, id, request.body);
			return reply.status(200).send(note);
		},
	);
};
