import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./schema";

export const PausalResolutionSource = pgEnum("pausal_resolution_source", [
  "user",
  "admin",
  "imported",
]);

export const ConfidenceLevel = pgEnum("confidence_level", [
  "low",
  "medium",
  "high",
]);

export const taxProfiles = pgTable("tax_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  country: text("country").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usaTaxProfiles = pgTable("usa_tax_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  taxProfileId: uuid("tax_profile_id")
    .notNull()
    .references(() => taxProfiles.id, { onDelete: "cascade" })
    .unique(),

  entityType: text("entity_type"),
  filingStatus: text("filing_status"),
  stateResidence: text("state_residence"),
  homeOfficeSqft: integer("home_office_sqft"),
  homeOfficeSimplified: boolean("home_office_simplified"),
  mileageTracking: boolean("mileage_tracking"),
  healthInsuranceDeduction: boolean("health_insurance_deduction"),
  retirementContribution: boolean("retirement_contribution"),
});

export const serbiaTaxProfiles = pgTable("serbia_tax_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  taxProfileId: uuid("tax_profile_id")
    .notNull()
    .references(() => taxProfiles.id, { onDelete: "cascade" })
    .unique(),

  // 1. REGIME
  regime: text("regime").notNull(), // "frilenser" | "pausal" | "knjigas"
  isUnder40: boolean("is_under_40").default(false),

  // 2. FRILENSER
  preferredModel: text("preferred_model"), // "modelA" | "modelB"
  healthInsuredElsewhere: boolean("health_insured_elsewhere").default(false),
  activeMonths: integer("active_months"), // 1–12, affects annual threshold
  numberOfClients: integer("number_of_clients"), // raw data behind independence test

  // 3. PAUSAL
  pausalActivityCode: text("pausal_activity_code"), // e.g. "62.01"
  pausalMunicipality: text("pausal_municipality"),
  pausalEmployeeCount: integer("pausal_employee_count").default(0),
  monthlyPausalTax: numeric("monthly_pausal_tax", { precision: 12, scale: 2 }),

  // 4. KNJIGAS
  businessModel: text("business_model"), // "services" | "goods" | "mixed"
  paysPersonalSalary: boolean("pays_personal_salary").default(false),
  personalSalaryAmount: numeric("personal_salary_amount", {
    precision: 12,
    scale: 2,
  }),
  vatThresholdWarning: boolean("vat_threshold_warning").default(false),
  businessExpenses: numeric("business_expenses", {
    precision: 12,
    scale: 2,
  }),

  // 5. VAT
  isInVatSystem: boolean("is_in_vat_system").default(false),

  // 6. INDEPENDENCE TEST
  independenceTestScore: integer("independence_test_score").default(0),
  independenceTestCalculatedAt: timestamp("independence_test_calculated_at"),

  // 7. SHARED FINANCIALS (amounts in RSD)
  estimatedAnnualGross: numeric("estimated_annual_gross", {
    precision: 12,
    scale: 2,
  }),

  // 8. META
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
});

// Purpose: Store real-world inputs, not “final truth”
export const pausalObservations = pgTable(
  "pausal_observations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    activityCode: text("activity_code").notNull(),
    municipalityCode: text("municipality_code")
      .references(() => municipalities.code)
      .notNull(),
    year: integer("year").notNull(),

    amountMonthly: numeric("amount_monthly", {
      precision: 12,
      scale: 2,
    }).notNull(),

    source: PausalResolutionSource("source").notNull(),
    sourceUserId: uuid("source_user_id"),

    isVerified: boolean("is_verified").default(false),

    // 0 → unknown
    // 1–50 → low trust
    // 51–80 → medium
    // 81–100 → high
    confidenceScore: integer("confidence_score").default(0),

    note: text("note"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      userActivityMunicipalityYearIdx: uniqueIndex(
        "user_activity_municipality_year_idx",
      ).on(
        table.sourceUserId,
        table.activityCode,
        table.municipalityCode,
        table.year,
      ),
    };
  },
);

// This table is: derived, recomputed periodically, safe to use in UI
export const pausalAggregates = pgTable(
  "pausal_aggregates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    activityCode: text("activity_code").notNull(),
    municipalityCode: text("municipality_code").notNull(),
    year: integer("year").notNull(),

    medianAmount: numeric("median_amount", {
      precision: 12,
      scale: 2,
    }).notNull(),
    meanAmount: numeric("mean_amount", { precision: 12, scale: 2 }).notNull(),

    minAmount: numeric("min_amount", { precision: 12, scale: 2 }).notNull(),
    maxAmount: numeric("max_amount", { precision: 12, scale: 2 }).notNull(),

    sampleSize: integer("sample_size").notNull(),

    confidenceLevel: ConfidenceLevel("confidence_level").notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      aggregateLookupIdx: index("aggregate_lookup_idx").on(
        table.activityCode,
        table.municipalityCode,
        table.year,
      ),
      activityMunicipalityYearUnique: unique(
        "activity_municipality_year_unique",
      ).on(table.activityCode, table.municipalityCode, table.year),
    };
  },
);

export const dailyExchangeRates = pgTable(
  "daily_exchange_rates",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // The official date the rate applies to
    date: date("date").notNull(),

    // "USD", "EUR", "CHF", etc.
    currencyCode: text("currency_code").notNull(),

    // The official NBS middle rate (Srednji kurs)
    // Most rates have 4-6 decimal places, so scale 6 is safe.
    middleRate: numeric("middle_rate", { precision: 14, scale: 6 }).notNull(),

    // Metadata for debugging or updates
    source: text("source").default("NBS"), // National Bank of Serbia
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      // CRITICAL: Prevents duplicate rates for the same day/currency
      // and makes searching by date+currency extremely fast.
      dateCurrencyIdx: uniqueIndex("date_currency_idx").on(
        table.date,
        table.currencyCode,
      ),
    };
  },
);

export const municipalities = pgTable("municipalities", {
  code: text("code").primaryKey(), // e.g. "KRUSEVAC"
  name: text("name").notNull(), // "Kruševac"
  city: text("city"), // optional (Beograd, Niš...)
  taxZone: integer("tax_zone"), // for paušal calculation later
});
