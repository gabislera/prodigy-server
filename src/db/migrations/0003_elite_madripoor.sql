-- Drop the old tasks table and items table, then recreate tasks with the new structure
DROP TABLE IF EXISTS "tasks" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "items" CASCADE;--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text DEFAULT 'task' NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '',
	"priority" text DEFAULT 'medium',
	"column_id" text,
	"position" integer DEFAULT 0,
	"completed" boolean DEFAULT false,
	"all_day" boolean DEFAULT false,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"google_event_id" text,
	"google_calendar_id" text,
	"hangout_link" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_column_id_task_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."task_columns"("id") ON DELETE set null ON UPDATE no action;