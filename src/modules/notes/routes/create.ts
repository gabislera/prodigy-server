import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../types/fastify";
import { notesController } from "../controller";
import { createNoteSchema } from "../schema";

export const createNoteRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/",
		{
			preHandler: authGuard,
			schema: { body: createNoteSchema },
		},
		async (request: AuthenticatedRequest, reply) => {
			const userId = request.user.id;
			const note = await notesController.create(userId, request.body);
			return reply.status(201).send(note);
		},
	);
};
