import { openrouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import type { FastifyInstance } from "fastify";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export async function generateNoteRoute(app: FastifyInstance) {
	app.post(
		"/ai",
		{ preHandler: authGuard },
		async (request: AuthenticatedRequest, reply) => {
			const { messages } = request.body as { messages: UIMessage[] };

			const result = streamText({
				model: openrouter.chat("deepseek/deepseek-chat-v3.1:free"),
				messages: convertToModelMessages(messages),
				system: `Você é um assistente que ajuda o usuário a editar notas em Markdown. Sempre responda apenas com o conteúdo atualizado da nota, sem explicações extras, sem aspas no início ou fim.`,
			});

			return reply.send(result.toUIMessageStreamResponse());
		},
	);
}
