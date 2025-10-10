import type { FastifyInstance } from "fastify";
import { getColumnsRoute } from "./get";
import { updateColumnsOrderRoute } from "./update-order";

export async function registerColumnRoutes(server: FastifyInstance) {
	await getColumnsRoute(server, {});
	await updateColumnsOrderRoute(server, {});
}
