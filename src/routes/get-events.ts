import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";

export const getEventsRoute: FastifyPluginAsyncZod = async (server) => {
	server.get("/events", async () => {
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
			.orderBy(schema.events.startDate);

		return results;
	});
};
