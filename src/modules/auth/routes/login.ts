import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authController } from "../controller";
import { loginSchema } from "../schema";

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/auth/login",
		{
			schema: {
				body: loginSchema,
			},
		},
		async (request, reply) => {
			try {
				const { email, password } = request.body;
				const result = await authController.login(email, password);

				reply.setCookie("refreshToken", result.sessionToken, {
					httpOnly: true,
					sameSite: "lax",
					secure: process.env.NODE_ENV === "production",
					path: "/",
					expires: result.expiresAt,
				});

				return reply.send({
					accessToken: result.accessToken,
					user: result.user,
				});
			} catch (error) {
				return reply.status(401).send({
					error: error instanceof Error ? error.message : "Invalid credentials",
				});
			}
		},
	);
};
