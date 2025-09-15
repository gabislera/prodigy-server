import { FastifyInstance } from "fastify";

export async function generateNote(app: FastifyInstance) {
	app.get("/", (request, reply) => {
		reply.send({ text: "hello world" });
	});
}
