import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../types/fastify";

export const meRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/auth/me",
		{
			preHandler: authGuard,
		},
		async (request: AuthenticatedRequest, reply) => {
			// User info is already attached by authGuard middleware
			if (!request.user) {
				return reply.status(401).send({
					error: "Unauthorized",
					message: "User not authenticated",
				});
			}

			return reply.send({
				user: {
					id: request.user.id,
					name: request.user.name,
					email: request.user.email,
				},
			});
		},
	);
};
