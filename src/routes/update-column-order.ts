import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";
import { authGuard } from "../plugins/auth-guard";
import type { AuthenticatedRequest } from "../types/fastify";

export const updateColumnOrderRoute: FastifyPluginAsyncZod = async (server) => {
	server.put(
		"/task_groups/:id/columns/order",
		{
			preHandler: authGuard,
			schema: {
				params: z.object({
					id: z.uuid(),
				}),
				body: z.object({
					columnOrders: z.array(
						z.object({
							columnId: z.uuid(),
							order: z.number(),
						}),
					),
				}),
			},
		},
		async (request: AuthenticatedRequest, reply) => {
			const { columnOrders } = request.body;

			const userId = request.user.id;

			try {
				await db.transaction(async (tx) => {
					for (const { columnId, order } of columnOrders) {
						await tx
							.update(schema.taskColumns)
							.set({
								order,
								updatedAt: new Date(),
							})
							.where(
								and(
									eq(schema.taskColumns.id, columnId),
									eq(schema.taskColumns.userId, userId),
								),
							);
					}
				});

				return reply
					.status(200)
					.send({ message: "Ordem das colunas atualizada com sucesso" });
			} catch (error) {
				console.error("Erro ao atualizar ordem das colunas:", error);
				return reply.status(500).send({ message: "Erro interno do servidor" });
			}
		},
	);
};
