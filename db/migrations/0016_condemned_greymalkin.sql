ALTER TABLE "tax_settings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "tax_settings" CASCADE;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "paid_amount" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "paid_amount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "paid_after" text;--> statement-breakpoint
ALTER TABLE "project_calendar" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "project_finance" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_calendar" ADD CONSTRAINT "project_calendar_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_finance" ADD CONSTRAINT "project_finance_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;