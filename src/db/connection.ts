import postgres from "postgres";
import { env } from "../env";
import { drizzle } from "drizzle-orm/postgres-js";
import { schema } from "./schema";

export const pg = postgres(env.DATABASE_URL);
export const db = drizzle(pg, { schema, casing: "camelCase" });
