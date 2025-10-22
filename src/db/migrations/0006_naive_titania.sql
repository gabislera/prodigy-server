ALTER TABLE "tasks" DROP CONSTRAINT "tasks_column_id_task_columns_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_column_id_task_columns_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."task_columns"("id") ON DELETE cascade ON UPDATE no action;