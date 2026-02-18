CREATE TYPE "public"."project_status" AS ENUM('active', 'in_progress', 'completed', 'cancelled', 'on_hold', 'not_started');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"revenue" numeric(12, 2) NOT NULL,
	"expenses" numeric(12, 2) NOT NULL,
	"profit" numeric(12, 2) NOT NULL,
	"margin" numeric(12, 2) NOT NULL,
	"hourly_rate" numeric(12, 2) NOT NULL,
	"hours_worked" integer NOT NULL,
	"status" "project_status" DEFAULT 'not_started' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;