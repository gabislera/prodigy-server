import { randomUUID } from "node:crypto";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { generateAccessToken, REFRESH_TOKEN_EXPIRES_DAYS } from "../utils/jwt";

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/auth/login",
		{
			schema: {
				body: z.object({
					email: z.email(),
					password: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const user = await db.query.users.findFirst({
				where: eq(schema.users.email, email),
			});

			if (!user || !user.passwordHash) {
				return reply.status(401).send({ error: "Invalid credentials" });
			}

			const isPasswordValid = await argon2.verify(user.passwordHash, password);

			if (!isPasswordValid) {
				return reply.status(401).send({ error: "Invalid credentials" });
			}

			const sessionToken = randomUUID();

			const expiresAt = new Date(
				Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
			);

			await db.insert(schema.sessions).values({
				userId: user.id,
				sessionToken,
				expiresAt,
			});

			const accessToken = generateAccessToken({
				id: user.id,
				name: user.name,
				email: user.email,
			});

			reply.setCookie("refreshToken", sessionToken, {
				httpOnly: true,
				sameSite: "strict",
				// secure: process.env.NODE_ENV === "production",
				path: "/",
				expires: expiresAt,
			});

			return { accessToken, user };
		},
	);
};
