import * as argon2 from "argon2";
import {
	generateAccessToken,
	generateRefreshToken,
	REFRESH_TOKEN_EXPIRES_SECONDS,
	verifyRefreshToken,
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

		const tokenPayload = {
			id: user.id,
			email: user.email,
			name: user.name,
		};

		// Generate JWT tokens
		const accessToken = generateAccessToken(tokenPayload);
		const refreshToken = generateRefreshToken(tokenPayload);

		// Store refresh token in database for validation
		const expiresAt = new Date(
			Date.now() + REFRESH_TOKEN_EXPIRES_SECONDS * 1000,
		);

		await authRepository.createSession({
			userId: user.id,
			sessionToken: refreshToken,
			expiresAt,
		});

		// Remove password hash from user object
		const { passwordHash: _passwordHash, ...userSafe } = user;

		return {
			accessToken,
			refreshToken,
			user: userSafe,
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

		// try {
		// 	const calendarGroup = await groupsController.create(user.id, {
		// 		name: "Calendar",
		// 		icon: "Calendar",
		// 		color: "#3b82f6",
		// 		bgColor: "#dbeafe",
		// 	});

		// 	await columnsController.create(user.id, {
		// 		groupId: calendarGroup.id,
		// 		title: "Calendar",
		// 		order: 0,
		// 	});
		// } catch (error) {
		// 	console.error("Error creating default Calendar group/column:", error);
		// }

		const tokenPayload = {
			id: user.id,
			email: user.email,
			name: user.name,
		};

		// Generate JWT tokens
		const accessToken = generateAccessToken(tokenPayload);
		const refreshToken = generateRefreshToken(tokenPayload);

		// Store refresh token in database for validation
		const expiresAt = new Date(
			Date.now() + REFRESH_TOKEN_EXPIRES_SECONDS * 1000,
		);

		await authRepository.createSession({
			userId: user.id,
			sessionToken: refreshToken,
			expiresAt,
		});

		return {
			user,
			accessToken,
			refreshToken,
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

		// Verify JWT signature and expiration
		try {
			verifyRefreshToken(refreshToken);
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : "Invalid refresh token",
			);
		}

		// Validate refresh token exists in database (not revoked)
		const session = await authRepository.findSession(refreshToken);

		if (!session) {
			throw new Error("Invalid or revoked session");
		}

		// Double-check session expiration
		if (new Date(session.expiresAt) < new Date()) {
			await authRepository.deleteSession(refreshToken);
			throw new Error("Session expired");
		}

		// Get fresh user data
		const user = await authRepository.findUserById(session.userId);

		if (!user) {
			throw new Error("User not found");
		}

		// Generate new access token with fresh user data
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
