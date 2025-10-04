import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../db/connection";
import { schema } from "../db/schema";

export const logoutRoute: FastifyPluginAsyncZod = async (server) => {
	server.post("/auth/logout", async (request, reply) => {
		const refreshToken = request.cookies.refreshToken;

		if (refreshToken) {
			await db
				.delete(schema.sessions)
				.where(eq(schema.sessions.sessionToken, refreshToken));
		}

		reply.clearCookie("refreshToken", {
			path: "/",
			sameSite: "lax",
		});

		return { success: true };
	});
};
