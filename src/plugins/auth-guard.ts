import type { FastifyReply } from "fastify";
import type { AuthenticatedRequest } from "../types/fastify";
import { verifyAccessToken } from "../utils/jwt";

export async function authGuard(
	request: AuthenticatedRequest,
	reply: FastifyReply,
) {
	const authHeader = request.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return reply.status(401).send({ error: "Unauthorized" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = verifyAccessToken(token);

		request.user = decoded as {
			id: string;
			name?: string;
			email?: string;
		};
	} catch {
		return reply.status(401).send({ error: "Unauthorized" });
	}
}
