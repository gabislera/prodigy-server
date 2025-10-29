import type { FastifyInstance } from "fastify";
import { loginRoute } from "./login";
import { logoutRoute } from "./logout";
import { meRoute } from "./me";
import { refreshTokenRoute } from "./refresh-token";
import { registerRoute } from "./register";
import { updateUserRoute } from "./update-user";

export async function registerAuthRoutes(server: FastifyInstance) {
	await loginRoute(server, {});
	await registerRoute(server, {});
	await logoutRoute(server, {});
	await refreshTokenRoute(server, {});
	await meRoute(server, {});
	await updateUserRoute(server, {});
}
