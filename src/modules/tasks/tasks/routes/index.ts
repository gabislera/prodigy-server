import type { FastifyInstance } from "fastify";
import { createTaskRoute } from "./create";
import { deleteTaskRoute } from "./delete";
import { updateTaskRoute } from "./update";

export async function registerTaskRoutes(server: FastifyInstance) {
	await createTaskRoute(server, {});
	await deleteTaskRoute(server, {});
	await updateTaskRoute(server, {});
}
