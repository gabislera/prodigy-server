import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../types/fastify";
import { authController } from "../controller";
import { updateUserSchema } from "../schema";

export const updateUserRoute: FastifyPluginAsyncZod = async (server) => {
	server.put(
		"/profile",
		{
			preHandler: authGuard,
			schema: {
				body: updateUserSchema,
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			try {
				const { name, email } = request.body;
				const userId = request.user.id;
				const result = await authController.updateUser(userId, { name, email });
				return reply.send(result);
			} catch (error) {
				return reply.status(400).send({
					error: error instanceof Error ? error.message : "Update failed",
				});
			}
		},
	);
};
