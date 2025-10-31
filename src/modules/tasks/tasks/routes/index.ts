import type { FastifyInstance } from "fastify";
import { createTaskRoute } from "./create";
import { deleteTaskRoute } from "./delete";
import { generateTaskRoute } from "./generate-ai";
import { getTasksRoute } from "./get";
import { updateTaskRoute } from "./update";

export async function registerTaskRoutes(server: FastifyInstance) {
	await getTasksRoute(server, {});
	await createTaskRoute(server, {});
	await deleteTaskRoute(server, {});
	await updateTaskRoute(server, {});
	await generateTaskRoute(server, {});
}
