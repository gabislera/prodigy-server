import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../env";

// Token expiration times
export const ACCESS_TOKEN_EXPIRES_SECONDS = 15 * 60; // 15 minutes
export const REFRESH_TOKEN_EXPIRES_DAYS = 30; // 30 days
export const REFRESH_TOKEN_EXPIRES_SECONDS =
	REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60;

// Secrets
const ACCESS_TOKEN_SECRET = env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = env.JWT_SECRET; // In production, use a different secret
const TOKEN_ALGO: jwt.Algorithm = "HS256";

export interface TokenPayload {
	id: string;
	name?: string;
	email?: string;
}

/**
 * Generate access token (short-lived, stored in httpOnly cookie)
 */
export function generateAccessToken(payload: TokenPayload): string {
	return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
		algorithm: TOKEN_ALGO,
		expiresIn: `${ACCESS_TOKEN_EXPIRES_SECONDS}s`,
	});
}

/**
 * Generate refresh token (long-lived, stored in httpOnly cookie)
 */
export function generateRefreshToken(payload: TokenPayload): string {
	return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
		algorithm: TOKEN_ALGO,
		expiresIn: `${REFRESH_TOKEN_EXPIRES_SECONDS}s`,
	});
}

/**
 * Verify and decode access token
 */
export function verifyAccessToken(token: string): TokenPayload {
	try {
		const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
		if (!decoded || typeof decoded === "string" || !("id" in decoded)) {
			throw new Error("Invalid token payload");
		}
		return {
			id: decoded.id,
			name: decoded.name as string | undefined,
			email: decoded.email as string | undefined,
		};
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new Error("Token expired");
		}
		if (error instanceof jwt.JsonWebTokenError) {
			throw new Error("Invalid token");
		}
		throw error;
	}
}

/**
 * Verify and decode refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload {
	try {
		const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
		if (!decoded || typeof decoded === "string" || !("id" in decoded)) {
			throw new Error("Invalid token payload");
		}
		return {
			id: decoded.id,
			name: decoded.name as string | undefined,
			email: decoded.email as string | undefined,
		};
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new Error("Refresh token expired");
		}
		if (error instanceof jwt.JsonWebTokenError) {
			throw new Error("Invalid refresh token");
		}
		throw error;
	}
}
