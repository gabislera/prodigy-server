import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../env";

export const ACCESS_TOKEN_EXPIRES_SECONDS = 15 * 60; // 15 min
export const REFRESH_TOKEN_EXPIRES_DAYS = 30; // 30 days

const ACCESS_TOKEN_SECRET = env.JWT_SECRET;
const ACCESS_TOKEN_ALGO: jwt.Algorithm = "HS256";

export interface AccessTokenPayload {
	id: string;
	name?: string;
	email?: string;
}

export function generateAccessToken(payload: AccessTokenPayload) {
	return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
		algorithm: ACCESS_TOKEN_ALGO,
		expiresIn: `${ACCESS_TOKEN_EXPIRES_SECONDS}s`,
	});
}

export function verifyAccessToken(token: string): AccessTokenPayload {
	const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
	if (!decoded || typeof decoded === "string" || !("id" in decoded)) {
		throw new Error("Invalid token payload");
	}
	return {
		id: decoded.id,
		name: decoded.name as string | undefined,
		email: decoded.email as string | undefined,
	};
}
