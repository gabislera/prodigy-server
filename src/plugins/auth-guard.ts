import type { FastifyReply } from "fastify";
import type { AuthenticatedRequest } from "../types/fastify";
import { ACCESS_TOKEN_COOKIE } from "../utils/cookie";
import { verifyAccessToken } from "../utils/jwt";

/**
 * Authentication middleware that verifies JWT from httpOnly cookie
 * This prevents XSS attacks by keeping the token inaccessible to JavaScript
 */
export async function authGuard(
	request: AuthenticatedRequest,
	reply: FastifyReply,
) {
	// Read access token from httpOnly cookie
	const token = request.cookies[ACCESS_TOKEN_COOKIE];

	if (!token) {
		return reply.status(401).send({
			error: "Unauthorized",
			message: "Authentication required",
		});
	}

	try {
		// Verify and decode the JWT
		const decoded = verifyAccessToken(token);

		// Attach user info to request object
		request.user = {
			id: decoded.id,
			name: decoded.name,
			email: decoded.email,
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Invalid token";

		return reply.status(401).send({
			error: "Unauthorized",
			message: errorMessage,
		});
	}
}
