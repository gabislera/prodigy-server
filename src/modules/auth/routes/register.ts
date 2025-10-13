import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authController } from "../controller";
import { registerSchema } from "../schema";

export const registerRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/auth/register",
		{
			schema: {
				body: registerSchema,
			},
		},
		async (request, reply) => {
			try {
				const { email, name, password } = request.body;
				const result = await authController.register({ email, name, password });

				reply.setCookie("refreshToken", result.sessionToken, {
					httpOnly: true,
					sameSite: "lax",
					secure: process.env.NODE_ENV === "production",
					path: "/",
					expires: result.expiresAt,
				});

				return reply.send({
					user: result.user,
					accessToken: result.accessToken,
				});
			} catch (error) {
				return reply.status(400).send({
					error: error instanceof Error ? error.message : "Registration failed",
				});
			}
		},
	);
};
