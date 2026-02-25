CREATE TABLE "project_revenue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"revenue" numeric(12, 2) NOT NULL,
	"expenses" numeric(12, 2) NOT NULL,
	"profit" numeric(12, 2) NOT NULL,
	"margin" numeric(12, 2) NOT NULL,
	"hourly_rate" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "revenue" TO "total_revenue";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "expenses" TO "total_expenses";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "profit" TO "total_profit";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "margin" TO "total_margin";--> statement-breakpoint
ALTER TABLE "projects" RENAME COLUMN "hours_worked" TO "total_hours_worked";--> statement-breakpoint
ALTER TABLE "project_revenue" ADD CONSTRAINT "project_revenue_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "hourly_rate";