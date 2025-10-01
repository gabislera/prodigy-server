import fastifyCors from "@fastify/cors";
import Fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { createEventRoute } from "./routes/create-event";
import { createNoteRoute } from "./routes/create-note";
import { createTaskRoute } from "./routes/create-task";
import { createTaskGroupRoute } from "./routes/create-task-group";
import { deleteEventRoute } from "./routes/delete-event";
import { deleteNoteRoute } from "./routes/delete-note";
import { deleteTaskRoute } from "./routes/delete-task";
import { generateNoteRoute } from "./routes/generate-note";
import { getEventsRoute } from "./routes/get-events";
import { getNotesRoute } from "./routes/get-notes";
import { getTaskColumnsRoute } from "./routes/get-task-columns";
import { getTaskGroupsRoute } from "./routes/get-task-groups";
import { updateColumnOrderRoute } from "./routes/update-column-order";
import { updateNoteRoute } from "./routes/update-note";
import { updateTaskRoute } from "./routes/update-task";

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
server.register(createEventRoute);
server.register(getEventsRoute);
server.register(deleteEventRoute);
server.register(createTaskGroupRoute);
server.register(createTaskRoute);
server.register(getTaskGroupsRoute);
server.register(getTaskColumnsRoute);
server.register(updateTaskRoute);
server.register(updateColumnOrderRoute);
server.register(deleteTaskRoute);

server.listen({ port: env.PORT }).then(() => {
	console.log("HTTP server running!");
});
