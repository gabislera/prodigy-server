import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authGuard } from "../../../plugins/auth-guard";
import type { AuthenticatedRequest } from "../../../types/fastify";
import { notesController } from "../controller";
import { noteParamsSchema } from "../schema";

export const deleteNoteRoute: FastifyPluginAsyncZod = async (server) => {
	server.delete(
		"/:id",
		{
			preHandler: authGuard,
			schema: { params: noteParamsSchema },
		},
		async (request: AuthenticatedRequest, reply) => {
			const userId = request.user.id;
			const { id } = request.params;
			await notesController.delete(userId, id);
			return reply.status(200).send({ message: "Nota deletada com sucesso" });
		},
	);
};
