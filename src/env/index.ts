import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3333),
	FRONTEND_URL: z.url().optional(),
	OPENROUTER_API_KEY: z.string(),
	DATABASE_URL: z.url().startsWith("postgresql://"),
	JWT_SECRET: z.string().min(10),
});

export const env = envSchema.parse(process.env);
