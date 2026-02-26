DROP TABLE "project_revenue" CASCADE;--> statement-breakpoint
ALTER TABLE "project_finance" ADD COLUMN "amount" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "project_finance" ADD COLUMN "note" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "project_finance" DROP COLUMN "hourly_rate";