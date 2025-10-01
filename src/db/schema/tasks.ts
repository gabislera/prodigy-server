import { relations } from "drizzle-orm";
import {
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const priorityEnum = pgEnum("priority", ["high", "medium", "low"]);

export const taskGroups = pgTable("task_groups", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	icon: text("icon").notNull(),
	color: text("color").notNull(),
	bgColor: text("bg_color").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const taskColumns = pgTable("task_columns", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	groupId: uuid("group_id")
		.notNull()
		.references(() => taskGroups.id, { onDelete: "cascade" }),
	order: integer("order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const tasks = pgTable("tasks", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	priority: priorityEnum("priority").default("medium").notNull(),
	columnId: uuid("column_id")
		.notNull()
		.references(() => taskColumns.id, { onDelete: "cascade" }),
	position: integer("position").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const taskGroupsRelations = relations(taskGroups, ({ many }) => ({
	columns: many(taskColumns),
}));

export const taskColumnsRelations = relations(taskColumns, ({ one, many }) => ({
	group: one(taskGroups, {
		fields: [taskColumns.groupId],
		references: [taskGroups.id],
	}),
	tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
	column: one(taskColumns, {
		fields: [tasks.columnId],
		references: [taskColumns.id],
	}),
}));
