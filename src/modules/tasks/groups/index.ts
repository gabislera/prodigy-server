export * from "./controller";
export * from "./repository";
export * from "./routes";
export * from "./schema";

import type { FastifyInstance } from "fastify";
import { registerGroupRoutes } from "./routes";

export async function registerTaskGroupRoutes(server: FastifyInstance) {
	await registerGroupRoutes(server);
}
