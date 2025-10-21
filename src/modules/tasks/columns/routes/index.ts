import type { FastifyInstance } from "fastify";
import { createColumnRoute } from "./create";
import { deleteColumnRoute } from "./delete";
import { getColumnsRoute } from "./get";
import { updateColumnRoute } from "./update";
import { updateColumnsOrderRoute } from "./update-order";

export async function registerColumnRoutes(server: FastifyInstance) {
	await createColumnRoute(server, {});
	await getColumnsRoute(server, {});
	await updateColumnRoute(server, {});
	await updateColumnsOrderRoute(server, {});
	await deleteColumnRoute(server, {});
}
