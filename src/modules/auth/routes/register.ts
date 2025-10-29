import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
	ACCESS_TOKEN_COOKIE,
	accessTokenCookieOptions,
	REFRESH_TOKEN_COOKIE,
	refreshTokenCookieOptions,
} from "../../../utils/cookie";
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

				// Set access token in httpOnly cookie (short-lived)
				reply.setCookie(
					ACCESS_TOKEN_COOKIE,
					result.accessToken,
					accessTokenCookieOptions,
				);

				// Set refresh token in httpOnly cookie (long-lived)
				reply.setCookie(
					REFRESH_TOKEN_COOKIE,
					result.refreshToken,
					refreshTokenCookieOptions,
				);

				// Return only user data (no tokens in response body)
				return reply.send({
					user: result.user,
					message: "Registration successful",
				});
			} catch (error) {
				return reply.status(400).send({
					error: "Registration failed",
					message:
						error instanceof Error ? error.message : "Registration failed",
				});
			}
		},
	);
};
