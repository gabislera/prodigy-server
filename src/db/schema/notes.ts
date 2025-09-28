import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	content: text("content"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
