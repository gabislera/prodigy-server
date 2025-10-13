import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authController } from "../controller";

export const logoutRoute: FastifyPluginAsyncZod = async (server) => {
	server.post("/auth/logout", async (request, reply) => {
		const refreshToken = request.cookies.refreshToken;
		await authController.logout(refreshToken);

		reply.clearCookie("refreshToken", {
			path: "/",
			sameSite: "lax",
		});

		return { success: true };
	});
};
