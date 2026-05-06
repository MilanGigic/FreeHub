CREATE TYPE "public"."confidence_level" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."pausal_resolution_source" AS ENUM('user', 'imported', 'admin');--> statement-breakpoint
CREATE TABLE "pausal_aggregates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_code" text NOT NULL,
	"municipality_code" text NOT NULL,
	"year" integer NOT NULL,
	"median_amount" numeric(12, 2) NOT NULL,
	"mean_amount" numeric(12, 2) NOT NULL,
	"min_amount" numeric(12, 2) NOT NULL,
	"max_amount" numeric(12, 2) NOT NULL,
	"sample_size" integer NOT NULL,
	"confidence_level" "confidence_level" NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pausal_rates" DROP CONSTRAINT "pausal_rates_municipality_code_municipalities_code_fk";
--> statement-breakpoint
ALTER TABLE "pausal_rates" ADD COLUMN "amount_monthly" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "pausal_rates" ADD COLUMN "source" "pausal_resolution_source" NOT NULL;--> statement-breakpoint
ALTER TABLE "pausal_rates" ADD COLUMN "source_user_id" uuid;--> statement-breakpoint
ALTER TABLE "pausal_rates" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "pausal_rates" ADD COLUMN "confidence_height" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "pausal_rates" ADD COLUMN "note" text;--> statement-breakpoint
CREATE INDEX "activity_municipality_year_idx" ON "pausal_rates" USING btree ("activity_code","municipality_code","year");--> statement-breakpoint
ALTER TABLE "pausal_rates" DROP COLUMN "total_monthly";--> statement-breakpoint
ALTER TABLE "pausal_rates" DROP COLUMN "income_tax";--> statement-breakpoint
ALTER TABLE "pausal_rates" DROP COLUMN "pio";--> statement-breakpoint
ALTER TABLE "pausal_rates" DROP COLUMN "health";--> statement-breakpoint
ALTER TABLE "pausal_rates" ADD CONSTRAINT "pausal_rates_source_user_id_unique" UNIQUE("source_user_id");