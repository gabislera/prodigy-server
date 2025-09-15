import { deepseek } from "@ai-sdk/deepseek";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { FastifyInstance } from "fastify";

export async function generateNote(app: FastifyInstance) {
	app.post("/ai", async (request, reply) => {
		const { prompt } = request.body as { prompt: string };
		const result = await generateText({
			model: openrouter.chat("deepseek/deepseek-chat-v3.1:free"),
			prompt,
			system: "Voce é uma ia especializada em resumir coisas de forma sucinta",
		});

		reply.send({ message: result });
	});
}
