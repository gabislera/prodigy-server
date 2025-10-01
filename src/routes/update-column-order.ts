import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";

export const updateColumnOrderRoute: FastifyPluginAsyncZod = async (server) => {
	server.put(
		"/task_groups/:id/columns/order",
		{
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
		async (request, reply) => {
			const { columnOrders } = request.body;

			try {
				await db.transaction(async (tx) => {
					for (const { columnId, order } of columnOrders) {
						await tx
							.update(schema.taskColumns)
							.set({
								order,
								updatedAt: new Date(),
							})
							.where(eq(schema.taskColumns.id, columnId));
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
