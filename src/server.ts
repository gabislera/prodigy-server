import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import Fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { registerNoteRoutes } from "./modules/notes";
import { createEventRoute } from "./routes/create-event";
import { createTaskRoute } from "./routes/create-task";
import { createTaskGroupRoute } from "./routes/create-task-group";
import { deleteEventRoute } from "./routes/delete-event";
import { deleteTaskRoute } from "./routes/delete-task";
import { deleteTaskGroupRoute } from "./routes/delete-task-group";
import { getEventsRoute } from "./routes/get-events";
import { getTaskColumnsRoute } from "./routes/get-task-columns";
import { getTaskGroupsRoute } from "./routes/get-task-groups";
import { loginRoute } from "./routes/login";
import { logoutRoute } from "./routes/logout";
import { refreshTokenRoute } from "./routes/refresh-token";
import { registerRoute } from "./routes/register";
import { updateColumnOrderRoute } from "./routes/update-column-order";
import { updateTaskRoute } from "./routes/update-task";
import { updateTaskGroupRoute } from "./routes/update-task-group";
import { updateUser } from "./routes/update-user";

const server = Fastify().withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors, {
	origin: true, // Allow credentials
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
});

server.register(fastifyCookie);

server.register(registerNoteRoutes, { prefix: "/notes" });

server.register(createEventRoute);
server.register(getEventsRoute);
server.register(deleteEventRoute);
server.register(createTaskGroupRoute);
server.register(createTaskRoute);
server.register(getTaskGroupsRoute);
server.register(getTaskColumnsRoute);
server.register(updateTaskRoute);
server.register(updateTaskGroupRoute);
server.register(updateColumnOrderRoute);
server.register(deleteTaskRoute);
server.register(deleteTaskGroupRoute);
server.register(loginRoute);
server.register(registerRoute);
server.register(logoutRoute);
server.register(refreshTokenRoute);
server.register(updateUser);

server.listen({ port: env.PORT }).then(() => {
	console.log("HTTP server running!");
});
