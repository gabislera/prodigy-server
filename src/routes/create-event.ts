import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const createEventRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/events",
		{
			preHandler: authGuard,
			schema: {
				body: z.object({
					title: z.string().min(1),
					description: z.string().optional(),
					startDate: z.string().min(1),
					endDate: z.string().min(1),
					type: z.string().min(1),
				}),
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			const { title, description, type, startDate, endDate } = request.body;

			const userId = request.user.id;

			const result = await db
				.insert(schema.events)
				.values({
					userId,
					title,
					description,
					type,
					startDate: new Date(startDate),
					endDate: new Date(endDate),
				})
				.returning();

			const insertedEvent = result[0];

			if (!insertedEvent) {
				throw new Error("Failed to create event");
			}

			return reply.status(201).send(insertedEvent);
		},
	);
};
