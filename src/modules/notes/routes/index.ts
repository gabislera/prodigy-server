import type { FastifyInstance } from "fastify";
import { createNoteRoute } from "./create";
import { deleteNoteRoute } from "./delete";
import { generateNoteRoute } from "./generate-ia";
import { getNotesRoute } from "./get";
import { updateNoteRoute } from "./update";

export async function registerNoteRoutes(server: FastifyInstance) {
	await createNoteRoute(server, {});
	await updateNoteRoute(server, {});
	await deleteNoteRoute(server, {});
	await getNotesRoute(server, {});
	await generateNoteRoute(server, {});
}
