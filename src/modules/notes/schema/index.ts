import { z } from "zod";

export const createNoteSchema = z.object({
	title: z.string().min(1),
	content: z.string().optional(),
});

export const updateNoteSchema = z.object({
	title: z.string().min(1),
	content: z.string().optional(),
});

export const noteParamsSchema = z.object({
	id: z.string(),
});

export const deleteNoteSchema = z.object({
	id: z.string(),
});
