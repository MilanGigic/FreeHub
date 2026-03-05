CREATE TABLE "tax_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"entity_type" text,
	"filing_status" text,
	"state_residence" text,
	"home_office_sqft" integer,
	"home_office_simplified" boolean,
	"mileage_tracking" boolean,
	"health_insurance_deduction" boolean,
	"estimated_gross_2026" numeric(12, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tax_profiles" ADD CONSTRAINT "tax_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;