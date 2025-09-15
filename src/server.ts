import fastifyCors from "@fastify/cors";
import Fastify from "fastify";
import { generateNote } from "./routes/generate-note";
import { env } from "./env";

const server = Fastify();

server.register(fastifyCors, {
	origin: "*",
});

server.register(generateNote);

server.listen({ port: env.PORT }).then(() => {
	console.log("HTTP server running!");
});
