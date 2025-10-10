export * from "./controller";
export * from "./repository";
export * from "./routes";
export * from "./schema";

import type { FastifyInstance } from "fastify";
import { registerColumnRoutes } from "./routes";

export async function registerTaskColumnRoutes(server: FastifyInstance) {
	await registerColumnRoutes(server);
}
