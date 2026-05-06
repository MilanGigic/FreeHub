ALTER TABLE "pausal_rates" RENAME TO "pausal_observations";--> statement-breakpoint
ALTER TABLE "pausal_observations" DROP CONSTRAINT "pausal_rates_source_user_id_unique";--> statement-breakpoint
ALTER TABLE "pausal_observations" ALTER COLUMN "source" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."pausal_resolution_source";--> statement-breakpoint
CREATE TYPE "public"."pausal_resolution_source" AS ENUM('user', 'admin', 'imported');--> statement-breakpoint
ALTER TABLE "pausal_observations" ALTER COLUMN "source" SET DATA TYPE "public"."pausal_resolution_source" USING "source"::"public"."pausal_resolution_source";--> statement-breakpoint
DROP INDEX "activity_municipality_year_idx";--> statement-breakpoint
ALTER TABLE "pausal_aggregates" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "pausal_observations" ADD COLUMN "confidence_score" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "pausal_observations" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "pausal_observations" ADD CONSTRAINT "pausal_observations_municipality_code_municipalities_code_fk" FOREIGN KEY ("municipality_code") REFERENCES "public"."municipalities"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "aggregate_lookup_idx" ON "pausal_aggregates" USING btree ("activity_code","municipality_code","year");--> statement-breakpoint
CREATE UNIQUE INDEX "user_activity_municipality_year_idx" ON "pausal_observations" USING btree ("source_user_id","activity_code","municipality_code","year");--> statement-breakpoint
ALTER TABLE "pausal_observations" DROP COLUMN "confidence_height";--> statement-breakpoint
ALTER TABLE "pausal_aggregates" ADD CONSTRAINT "activity_municipality_year_unique" UNIQUE("activity_code","municipality_code","year");