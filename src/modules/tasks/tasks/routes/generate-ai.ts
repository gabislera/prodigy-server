import type { UIMessage } from "ai";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../../types/fastify";
import { tasksController } from "../controller";

export const generateTaskRoute: FastifyPluginAsyncZod = async (server) => {
	server.post(
		"/generate-ai",
		{ preHandler: authGuard },
		async (request: AuthenticatedRequest, reply) => {
			const { messages } = request.body as { messages: UIMessage[] };

			const result = await tasksController.generateAiTask(messages);

			return reply.send(result.toUIMessageStreamResponse());
		},
	);
};
