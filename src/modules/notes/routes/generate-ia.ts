import type { UIMessage } from "ai";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../types/fastify";
import { notesController } from "../controller";

export const generateNoteRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/generate-ai",
		{ preHandler: authGuard },
		async (request: AuthenticatedRequest, reply) => {
			const { messages } = request.body as { messages: UIMessage[] };

			const result = await notesController.generateAiNote(messages);

			return reply.send(result.toUIMessageStreamResponse());
		},
	);
};
