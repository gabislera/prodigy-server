import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const getEventsRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/events",
		{ preHandler: authGuard },
		async (request: AuthenticatedRequest) => {
			const userId = request.user.id;

			const results = await db
				.select({
					id: schema.events.id,
					title: schema.events.title,
					description: schema.events.description,
					type: schema.events.type,
					startDate: schema.events.startDate,
					endDate: schema.events.endDate,
					createdAt: schema.events.createdAt,
					updatedAt: schema.events.updatedAt,
				})
				.from(schema.events)
				.where(eq(schema.events.userId, userId))
				.orderBy(schema.events.startDate);

			return results;
		},
	);
};
