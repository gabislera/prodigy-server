import type { FastifyInstance } from "fastify";
import { createGroupRoute } from "./create";
import { deleteGroupRoute } from "./delete";
import { getGroupRoute } from "./get";
import { updateGroupRoute } from "./update";

export async function registerGroupRoutes(server: FastifyInstance) {
	await createGroupRoute(server, {});
	await deleteGroupRoute(server, {});
	await getGroupRoute(server, {});
	await updateGroupRoute(server, {});
}
