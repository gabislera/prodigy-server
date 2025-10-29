import type { CookieSerializeOptions } from "@fastify/cookie";
import { env } from "../env";
import {
	ACCESS_TOKEN_EXPIRES_SECONDS,
	REFRESH_TOKEN_EXPIRES_SECONDS,
} from "./jwt";

const isProduction = env.NODE_ENV === "production";

// Cookie names
export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

/**
 * Base cookie options following security best practices
 */
const baseCookieOptions: CookieSerializeOptions = {
	httpOnly: true, // Prevent XSS attacks by making cookie inaccessible to JavaScript
	secure: isProduction, // Only send cookie over HTTPS in production
	sameSite: "strict", // Prevent CSRF attacks
	path: "/", // Cookie available for all routes
};

/**
 * Access token cookie options (short-lived)
 */
export const accessTokenCookieOptions: CookieSerializeOptions = {
	...baseCookieOptions,
	maxAge: ACCESS_TOKEN_EXPIRES_SECONDS, // 15 minutes
};

/**
 * Refresh token cookie options (long-lived)
 */
export const refreshTokenCookieOptions: CookieSerializeOptions = {
	...baseCookieOptions,
	maxAge: REFRESH_TOKEN_EXPIRES_SECONDS, // 30 days
};

/**
 * Cookie clear options (used for logout)
 */
export const clearCookieOptions: CookieSerializeOptions = {
	path: "/",
	httpOnly: true,
	secure: isProduction,
	sameSite: "strict",
};
