import fastifyCors from "@fastify/cors";
import Fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateNoteRoute } from "./routes/generate-note";
import { env } from "./env";
import { createNoteRoute } from "./routes/create-note";
import { getNotesRoute } from "./routes/get-notes";
import { updateNoteRoute } from "./routes/update-note";
import { deleteNoteRoute } from "./routes/delete-note";

const server = Fastify().withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors, {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
});

server.register(generateNoteRoute);
server.register(createNoteRoute);
server.register(getNotesRoute);
server.register(updateNoteRoute);
server.register(deleteNoteRoute);

server.listen({ port: env.PORT }).then(() => {
	console.log("HTTP server running!");
});
