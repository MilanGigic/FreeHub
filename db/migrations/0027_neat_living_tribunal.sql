CREATE TABLE "pausal_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_code" text NOT NULL,
	"municipality_code" text NOT NULL,
	"total_monthly" numeric(12, 2) NOT NULL,
	"income_tax" numeric(12, 2),
	"pio" numeric(12, 2),
	"health" numeric(12, 2),
	"year" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pausal_rates" ADD CONSTRAINT "pausal_rates_municipality_code_municipalities_code_fk" FOREIGN KEY ("municipality_code") REFERENCES "public"."municipalities"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serbia_tax_profiles" DROP COLUMN "pausal_tax_category";