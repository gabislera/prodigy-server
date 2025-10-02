import { z } from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	OPENROUTER_API_KEY: z.string(),
	DATABASE_URL: z.url().startsWith("postgresql://"),
	JWT_SECRET: z.string().min(10),
});

export const env = envSchema.parse(process.env);
