import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authController } from "../controller";

export const refreshTokenRoute: FastifyPluginAsyncZod = async (server) => {
	server.post("/auth/refresh", async (request, reply) => {
		try {
			const refreshToken = request.cookies.refreshToken;
			if (!refreshToken) {
				return reply.status(401).send({ error: "Missing refresh token" });
			}
			const result = await authController.refreshToken(refreshToken);
			return reply.send({ accessToken: result.accessToken });
		} catch (error) {
			return reply.status(401).send({
				error: error instanceof Error ? error.message : "Invalid or expired session",
			});
		}
	});
};
