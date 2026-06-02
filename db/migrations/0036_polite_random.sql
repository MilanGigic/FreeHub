ALTER TABLE "transactions" ADD COLUMN "exchange_rate" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "amount_in_rsd" numeric(12, 2) NOT NULL;