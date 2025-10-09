import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../types/fastify";
import { notesController } from "../controller";
import { noteParamsSchema, updateNoteSchema } from "../schema";

export const updateNoteRoute: FastifyPluginAsyncZod = async (server) => {
	server.put(
		"/:id",
		{
			preHandler: authGuard,
			schema: {
				params: noteParamsSchema,
				body: updateNoteSchema,
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			const userId = request.user.id;
			const { id } = request.params;
			const note = await notesController.update(userId, id, request.body);
			return reply.status(200).send(note);
		},
	);
};
