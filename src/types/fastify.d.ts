import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		// user do token JWT, garantido pelo authGuard
		user?: {
			id: string;
			name?: string;
			email?: string;
		};
	}
}

// Rota autenticada: request.user é obrigatório
export type AuthenticatedRequest = FastifyRequest & {
	user: {
		id: string;
		name?: string;
		email?: string;
	};
};
