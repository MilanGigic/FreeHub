CREATE TABLE "daily_exchange_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"currency_code" text NOT NULL,
	"middle_rate" numeric(14, 6) NOT NULL,
	"source" text DEFAULT 'NBS',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "serbia_tax_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tax_profile_id" uuid NOT NULL,
	"regime" text NOT NULL,
	"is_under_40" boolean DEFAULT false,
	"preferred_model" text,
	"health_insured_elsewhere" boolean DEFAULT false,
	"active_months" integer,
	"number_of_clients" integer,
	"pausal_activity_code" text,
	"pausal_municipality" text,
	"pausal_tax_category" integer,
	"pausal_employee_count" integer DEFAULT 0,
	"monthly_pausal_tax" numeric(12, 2),
	"business_model" text,
	"pays_personal_salary" boolean DEFAULT false,
	"personal_salary_amount" numeric(12, 2),
	"vat_threshold_warning" boolean DEFAULT false,
	"is_in_vat_system" boolean DEFAULT false,
	"independence_test_score" integer DEFAULT 0,
	"independence_test_calculated_at" timestamp,
	"estimated_annual_gross" numeric(12, 2),
	"onboarding_completed_at" timestamp,
	CONSTRAINT "serbia_tax_profiles_tax_profile_id_unique" UNIQUE("tax_profile_id")
);
--> statement-breakpoint
CREATE TABLE "usa_tax_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tax_profile_id" uuid NOT NULL,
	"entity_type" text,
	"filing_status" text,
	"state_residence" text,
	"home_office_sqft" integer,
	"home_office_simplified" boolean,
	"mileage_tracking" boolean,
	"health_insurance_deduction" boolean,
	"retirement_contribution" boolean,
	CONSTRAINT "usa_tax_profiles_tax_profile_id_unique" UNIQUE("tax_profile_id")
);
--> statement-breakpoint
ALTER TABLE "tax_profiles" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tax_profiles" ADD COLUMN "country" text NOT NULL;--> statement-breakpoint
ALTER TABLE "serbia_tax_profiles" ADD CONSTRAINT "serbia_tax_profiles_tax_profile_id_tax_profiles_id_fk" FOREIGN KEY ("tax_profile_id") REFERENCES "public"."tax_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usa_tax_profiles" ADD CONSTRAINT "usa_tax_profiles_tax_profile_id_tax_profiles_id_fk" FOREIGN KEY ("tax_profile_id") REFERENCES "public"."tax_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "date_currency_idx" ON "daily_exchange_rates" USING btree ("date","currency_code");--> statement-breakpoint
ALTER TABLE "tax_profiles" DROP COLUMN "entity_type";--> statement-breakpoint
ALTER TABLE "tax_profiles" DROP COLUMN "filing_status";--> statement-breakpoint
ALTER TABLE "tax_profiles" DROP COLUMN "state_residence";--> statement-breakpoint
ALTER TABLE "tax_profiles" DROP COLUMN "home_office_sqft";--> statement-breakpoint
ALTER TABLE "tax_profiles" DROP COLUMN "home_office_simplified";--> statement-breakpoint
ALTER TABLE "tax_profiles" DROP COLUMN "mileage_tracking";--> statement-breakpoint
ALTER TABLE "tax_profiles" DROP COLUMN "health_insurance_deduction";--> statement-breakpoint
ALTER TABLE "tax_profiles" DROP COLUMN "retirement_contribution";