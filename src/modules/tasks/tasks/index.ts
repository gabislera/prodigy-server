export * from "./controller";
export * from "./repository";
export * from "./routes";
export * from "./schema";

import type { FastifyInstance } from "fastify";
import { registerTaskRoutes as registerTaskRoutesInternal } from "./routes";

export async function registerTaskRoutes(server: FastifyInstance) {
	await registerTaskRoutesInternal(server);
}
