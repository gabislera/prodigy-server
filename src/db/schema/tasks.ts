import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const priorityEnum = pgEnum("priority", ["high", "medium", "low"]);

export const taskGroups = pgTable("task_groups", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	userId: text("user_id").notNull(),
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
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	userId: text("user_id").notNull(),
	groupId: text("group_id")
		.notNull()
		.references(() => taskGroups.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	order: integer("order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const tasks = pgTable("tasks", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	userId: text("user_id").notNull(),
	columnId: text("column_id")
		.notNull()
		.references(() => taskColumns.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	description: text("description").notNull(),
	priority: priorityEnum("priority").default("medium").notNull(),
	position: integer("position").default(0).notNull(),
	completed: boolean("completed").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
export const items = pgTable("items", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuidv7()),

	userId: text("user_id").notNull(),

	type: text("type").default("task").notNull(), // "task" | "event"

	title: text("title").notNull(),
	description: text("description").default(""),

	priority: text("priority").default("medium"),

	columnId: text("column_id").references(() => taskColumns.id, {
		onDelete: "set null",
	}),

	position: integer("position").default(0),

	completed: boolean("completed").default(false),
	allDay: boolean("all_day").default(false),

	// Campos de tempo — opcionais (nullable)
	startDate: timestamp("start_date", { withTimezone: true }),
	endDate: timestamp("end_date", { withTimezone: true }),

	// Integração com Google Calendar — opcionais
	googleEventId: text("google_event_id"),
	googleCalendarId: text("google_calendar_id"),
	hangoutLink: text("hangout_link"),

	status: text("status").default("pending"),

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
