ALTER TABLE "transactions" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "is_recurring" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "merchant_name" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "transaction_date" timestamp NOT NULL;