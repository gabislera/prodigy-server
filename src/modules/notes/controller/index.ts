import { openrouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { notesRepository } from "../repository";

export const notesController = {
	async create(userId: string, data: { title: string; content?: string }) {
		const note = await notesRepository.create(userId, data);
		if (!note) throw new Error("Erro ao criar nota");
		return note;
	},

	async update(
		userId: string,
		id: string,
		data: { title: string; content?: string },
	) {
		const note = await notesRepository.update(userId, id, data);
		if (!note) throw new Error("Nota não encontrada");
		return note;
	},

	async delete(userId: string, id: string) {
		const note = await notesRepository.delete(userId, id);
		if (!note) throw new Error("Nota não encontrada");
		return note;
	},

	async get(userId: string) {
		const notes = await notesRepository.get(userId);
		if (!notes) throw new Error("Erro ao buscar notas");
		return notes;
	},

	async generateAiNote(messages: UIMessage[]) {
		const result = streamText({
			model: openrouter.chat("deepseek/deepseek-chat-v3.1:free"),
			messages: convertToModelMessages(messages),
			system: `Você é um assistente que ajuda o usuário a editar notas em Markdown. Sempre responda apenas com o conteúdo atualizado da nota, sem explicações extras, sem aspas no início ou fim.`,
		});
		if (!result) throw new Error("Error ao gerar nota");
		return result;
	},
};
