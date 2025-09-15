import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	OPENAI_API_KEY: z.string(),
	DEEPSEEK_API_KEY: z.string(),
	OPENROUTER_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
