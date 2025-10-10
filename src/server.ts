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
import { registerTaskColumnRoutes } from "./modules/tasks/columns";
import { registerTaskGroupRoutes } from "./modules/tasks/groups";
import { registerTaskRoutes } from "./modules/tasks/tasks";
import { loginRoute } from "./routes/login";
import { logoutRoute } from "./routes/logout";
import { refreshTokenRoute } from "./routes/refresh-token";
import { registerRoute } from "./routes/register";
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
server.register(registerTaskGroupRoutes, { prefix: "/groups" });
server.register(registerTaskColumnRoutes, { prefix: "/columns" });
server.register(registerTaskRoutes, { prefix: "/tasks" });

server.register(loginRoute);
server.register(registerRoute);
server.register(logoutRoute);
server.register(refreshTokenRoute);
server.register(updateUser);

server.listen({ port: env.PORT }).then(() => {
	console.log("HTTP server running!");
});
