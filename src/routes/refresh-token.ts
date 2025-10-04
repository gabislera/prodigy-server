import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { generateAccessToken } from "../utils/jwt";

export const refreshTokenRoute: FastifyPluginAsyncZod = async (server) => {
	server.post("/auth/refresh", async (request, reply) => {
		const refreshToken = request.cookies.refreshToken;

		if (!refreshToken) {
			return reply.status(401).send({ error: "Missing refresh token" });
		}

		const session = await db.query.sessions.findFirst({
			where: eq(schema.sessions.sessionToken, refreshToken),
		});

		if (!session || new Date(session.expiresAt) < new Date()) {
			return reply.status(401).send({ error: "Invalid or expired session" });
		}

		// Buscar dados do usuário para incluir no token
		const user = await db.query.users.findFirst({
			where: eq(schema.users.id, session.userId),
		});

		if (!user) {
			return reply.status(401).send({ error: "User not found" });
		}

		const accessToken = generateAccessToken({
			id: user.id,
			name: user.name,
			email: user.email,
		});

		return reply.send({ accessToken });
	});
};
