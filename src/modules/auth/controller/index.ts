import { randomUUID } from "node:crypto";
import * as argon2 from "argon2";
import {
	generateAccessToken,
	REFRESH_TOKEN_EXPIRES_DAYS,
} from "../../../utils/jwt";
import { authRepository } from "../repository";

const argon2Options: argon2.Options & { raw?: false } = {
	type: argon2.argon2id,
	memoryCost: 2 ** 16, // 64MB
	timeCost: 3,
	parallelism: 1,
	hashLength: 32,
};

export const authController = {
	async login(email: string, password: string) {
		const user = await authRepository.findUserByEmail(email);

		if (!user || !user.passwordHash) {
			throw new Error("Invalid credentials");
		}

		const isPasswordValid = await argon2.verify(user.passwordHash, password);
		if (!isPasswordValid) {
			throw new Error("Invalid credentials");
		}

		const sessionToken = randomUUID();
		const expiresAt = new Date(
			Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
		);

		await authRepository.createSession({
			userId: user.id,
			sessionToken,
			expiresAt,
		});

		const accessToken = generateAccessToken({
			id: user.id,
			email: user.email,
			name: user.name,
		});

		const { passwordHash: _, ...userSafe } = user as any;

		return {
			accessToken,
			user: userSafe,
			sessionToken,
			expiresAt,
		};
	},

	async register(data: { name: string; email: string; password: string }) {
		const existing = await authRepository.findUserByEmail(data.email);

		if (existing) {
			throw new Error("Email already in use");
		}

		const hash = await argon2.hash(data.password, argon2Options);

		const user = await authRepository.createUser({
			name: data.name,
			email: data.email,
			passwordHash: hash,
		});

		const sessionToken = randomUUID();
		const expiresAt = new Date(
			Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
		);

		await authRepository.createSession({
			userId: user.id,
			sessionToken,
			expiresAt,
		});

		const accessToken = generateAccessToken({
			id: user.id,
			name: user.name,
			email: user.email,
		});

		return {
			user,
			accessToken,
			sessionToken,
			expiresAt,
		};
	},

	async logout(refreshToken: string | undefined) {
		if (refreshToken) {
			await authRepository.deleteSession(refreshToken);
		}
		return { success: true };
	},

	async refreshToken(refreshToken: string) {
		if (!refreshToken) {
			throw new Error("Missing refresh token");
		}

		const session = await authRepository.findSession(refreshToken);

		if (!session || new Date(session.expiresAt) < new Date()) {
			throw new Error("Invalid or expired session");
		}

		const user = await authRepository.findUserById(session.userId);

		if (!user) {
			throw new Error("User not found");
		}

		const accessToken = generateAccessToken({
			id: user.id,
			name: user.name,
			email: user.email,
		});

		return { accessToken };
	},

	async updateUser(userId: string, data: { name?: string; email?: string }) {
		if (data.email) {
			const existing = await authRepository.findUserByEmail(data.email);

			if (existing && existing.id !== userId) {
				throw new Error("Email already exists");
			}
		}

		const updated = await authRepository.updateUser(userId, data);

		if (!updated) {
			throw new Error("User not found");
		}

		return { user: updated };
	},
};
