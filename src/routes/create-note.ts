import { db } from "../db/connection";
import { schema } from "../db/schema";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const createNoteRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/notes",
		{
			schema: {
				body: z.object({
					title: z.string().min(1),
					content: z.string().optional(),
				}),
			},
		},
		async (request, reply) => {
			const { title, content } = request.body;

			const result = await db
				.insert(schema.notes)
				.values({ title, content })
				.returning();

			const insertedNote = result[0];

			if (!insertedNote) {
				throw new Error("Failed to create new room");
			}

			return reply.status(201).send(insertedNote);
		},
	);
};
