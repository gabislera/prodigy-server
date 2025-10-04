import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const createNoteRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/notes",
		{
			preHandler: authGuard,
			schema: {
				body: z.object({
					title: z.string().min(1),
					content: z.string().optional(),
				}),
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			const { title, content } = request.body;

			const userId = request.user.id;

			const result = await db
				.insert(schema.notes)
				.values({ userId, title, content })
				.returning();

			const insertedNote = result[0];

			if (!insertedNote) {
				throw new Error("Failed to create new room");
			}

			return reply.status(201).send(insertedNote);
		},
	);
};
