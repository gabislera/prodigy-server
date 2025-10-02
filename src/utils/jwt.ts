import jwt from "jsonwebtoken";
import { env } from "../env";

export const ACCESS_TOKEN_EXPIRES = "15m";
export const REFRESH_TOKEN_EXPIRES_DAYS = 7;

export function generateAccessToken(userId: string) {
	return jwt.sign({ sub: userId }, env.JWT_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRES,
	});
}
