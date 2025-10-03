import jwt from "jsonwebtoken";
import { env } from "../env";

export const ACCESS_TOKEN_EXPIRES = "15m";
export const REFRESH_TOKEN_EXPIRES_DAYS = 7;

export function generateAccessToken(user: {
	id: string;
	name: string;
	email: string;
}) {
	return jwt.sign(
		{
			sub: user.id,
			name: user.name,
			email: user.email,
		},
		env.JWT_SECRET,
		{
			expiresIn: ACCESS_TOKEN_EXPIRES,
		},
	);
}
