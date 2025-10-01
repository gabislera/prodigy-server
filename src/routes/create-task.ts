import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";

export const createTaskRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/task",
		{
			schema: {
				body: z.object({
					title: z.string().min(1),
					description: z.string().optional().default(""),
					priority: z.enum(["high", "medium", "low"]).default("medium"),
					columnId: z.uuid(),
					position: z.number().optional().default(0),
					completed: z.boolean().optional().default(false),
				}),
			},
		},
		async (request, reply) => {
			const { title, description, priority, columnId, position, completed } =
				request.body;

			const [task] = await db
				.insert(schema.tasks)
				.values({ title, description, priority, columnId, position, completed })
				.returning();

			return reply.status(201).send(task);
		},
	);
};
