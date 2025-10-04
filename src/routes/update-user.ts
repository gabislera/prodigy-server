import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const updateUser: FastifyPluginAsyncZod = async (server) => {
	server.put("/profile", {
		preHandler: authGuard,
		schema: {
			body: z.object({
				name: z.string().min(1).optional(),
				email: z.string().email().optional(),
			}),
		},
		handler: async (request: AuthenticatedRequest, reply) => {
			const { name, email } = request.body;
			const userId = request.user.id;

			if (email) {
				const existing = await db.query.users.findFirst({
					where: eq(schema.users.email, email),
				});

				if (existing && existing.id !== userId) {
					return reply.status(400).send({ message: "Email already exists" });
				}
			}

			const updated = await db.query.users.findFirst({
				where: eq(schema.users.id, userId),
				columns: {
					id: true,
					name: true,
					email: true,
					createdAt: true,
					updatedAt: true,
				},
			});

			return reply.send({ user: updated });
		},
	});
};
