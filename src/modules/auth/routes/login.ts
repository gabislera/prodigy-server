import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
	ACCESS_TOKEN_COOKIE,
	accessTokenCookieOptions,
	REFRESH_TOKEN_COOKIE,
	refreshTokenCookieOptions,
} from "../../../utils/cookie";
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
					message: "Login successful",
				});
			} catch (error) {
				return reply.status(401).send({
					error: "Authentication failed",
					message:
						error instanceof Error ? error.message : "Invalid credentials",
				});
			}
		},
	);
};
