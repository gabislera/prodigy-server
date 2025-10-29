import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
	ACCESS_TOKEN_COOKIE,
	accessTokenCookieOptions,
	REFRESH_TOKEN_COOKIE,
} from "../../../utils/cookie";
import { authController } from "../controller";

export const refreshTokenRoute: FastifyPluginAsyncZod = async (server) => {
	server.post("/auth/refresh", async (request, reply) => {
		try {
			// Get refresh token from httpOnly cookie
			const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE];

			if (!refreshToken) {
				return reply.status(401).send({
					error: "Unauthorized",
					message: "Missing refresh token",
				});
			}

			// Generate new access token using refresh token
			const result = await authController.refreshToken(refreshToken);

			// Set new access token in httpOnly cookie
			reply.setCookie(
				ACCESS_TOKEN_COOKIE,
				result.accessToken,
				accessTokenCookieOptions,
			);

			// Return success (no token in response body)
			return reply.send({
				success: true,
				message: "Token refreshed successfully",
			});
		} catch (error) {
			return reply.status(401).send({
				error: "Token refresh failed",
				message:
					error instanceof Error ? error.message : "Invalid or expired session",
			});
		}
	});
};
