import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
	ACCESS_TOKEN_COOKIE,
	clearCookieOptions,
	REFRESH_TOKEN_COOKIE,
} from "../../../utils/cookie";
import { authController } from "../controller";

export const logoutRoute: FastifyPluginAsyncZod = async (server) => {
	server.post("/auth/logout", async (request, reply) => {
		try {
			// Get refresh token from cookie to invalidate session
			const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE];

			// Invalidate session in database
			if (refreshToken) {
				await authController.logout(refreshToken);
			}

			// Clear both access and refresh token cookies
			reply.clearCookie(ACCESS_TOKEN_COOKIE, clearCookieOptions);
			reply.clearCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions);

			return reply.send({
				success: true,
				message: "Logout successful",
			});
		} catch (error) {
			// Even if there's an error, clear the cookies
			reply.clearCookie(ACCESS_TOKEN_COOKIE, clearCookieOptions);
			reply.clearCookie(REFRESH_TOKEN_COOKIE, clearCookieOptions);

			return reply.status(500).send({
				error: "Logout failed",
				message: error instanceof Error ? error.message : "Unknown error",
			});
		}
	});
};
