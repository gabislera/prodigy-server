import { randomUUID } from "node:crypto";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { generateAccessToken, REFRESH_TOKEN_EXPIRES_DAYS } from "../utils/jwt";

const argon2Options: argon2.Options & { raw?: false } = {
	type: argon2.argon2id,
	memoryCost: 2 ** 16, // 64MB
	timeCost: 3,
	parallelism: 1,
	hashLength: 32,
};

export const registerRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/auth/register",
		{
			schema: {
				body: z.object({
					name: z.string().min(2),
					email: z.string().email(),
					password: z.string().min(6),
				}),
			},
		},
		async (request, reply) => {
			const { email, name, password } = request.body;

			const existing = await db.query.users.findFirst({
				where: eq(schema.users.email, email),
			});

			if (existing) {
				return reply.status(400).send({ error: "Email already in use" });
			}

			const hash = await argon2.hash(password, argon2Options);

			const [user] = await db
				.insert(schema.users)
				.values({ name, email, passwordHash: hash })
				.returning();

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

			return { user, accessToken };
		},
	);
};
