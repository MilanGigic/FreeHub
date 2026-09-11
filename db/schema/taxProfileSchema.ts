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
  varchar,
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

export const countryEnum = pgEnum("country_enum", ["RS", "US"]);
export const taxResidencyEnum = pgEnum("tax_residency_enum", [
  "resident",
  "non_resident",
  "unknown",
]);

export const regimeEnum = pgEnum("regime_enum", [
  "freelancer",
  "pausal",
  "knjigas",
  "d.o.o.",
  "employee",
  "hybrid",
]);
export const frilenserModelEnum = pgEnum("frilenser_model", ["A", "B"]);

export const entityTypeEnum = pgEnum("entity_type_enum", [
  "sole_prop",
  "llc_single",
  "llc_multi",
  "s_corp",
  "c_corp",
]);
export const filingStatusEnum = pgEnum("filing_status_enum", [
  "single",
  "mfj",
  "mfs",
  "hoh",
  "qw",
]);

export const taxProfile = pgTable("tax_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  country: countryEnum("country").notNull(),
  taxResidency: taxResidencyEnum("tax_residency").notNull(),
  isUnder40: boolean("is_under_40").notNull(),
  primaryHealthInsuredElsewhere: boolean(
    "primary_health_insured_elsewhere",
  ).notNull(),
  alreadyEmployed: boolean("already_employed").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
export const taxProfileSerbia = pgTable("tax_profile_serbia", {
  id: uuid("id").primaryKey().defaultRandom(),
  taxProfileId: uuid("tax_profile_id").references(() => taxProfile.id, {
    onDelete: "cascade",
  }),
  currentRegime: regimeEnum("current_regime").notNull(),
  preferredFrilenserModel: frilenserModelEnum("preferred_frilenser_model"),
  activityCode: varchar("activity_code", { length: 256 }),
  municipalityId: uuid("municipality_id").references(() => municipalities.id, {
    onDelete: "cascade",
  }),
  officialPausalMonthlyAmount: numeric("official_pausal_monthly_amount", {
    precision: 10,
    scale: 2,
  }),
  pausalResenjeDate: timestamp("pausal_resenje_date", { mode: "date" }),
  pausalResenjeDocumentUrl: text("pausal_resenje_document_url"),
  personalSalaryElected: boolean("personal_salary_elected"),
  personalSalaryGrossMonthly: numeric("personal_salary_gross_monthly", {
    precision: 10,
    scale: 2,
  }),
  vatRegistered: boolean("vat_registered").notNull(),
  vatRegistrationDate: timestamp("vat_registration_date", { mode: "date" }),
  estimatedAnnualGross: numeric("estimated_annual_gross", {
    precision: 10,
    scale: 2,
  }).notNull(),
  notes: text("notes"),
});

export const taxProfileUsa = pgTable("tax_profile_usa", {
  id: uuid("id").primaryKey().defaultRandom(),
  taxProfileId: uuid("tax_profile_id").references(() => taxProfile.id, {
    onDelete: "cascade",
  }),
  entityType: entityTypeEnum("entity_type").notNull(),
  filingStatus: filingStatusEnum("filing_status").notNull(),
  stateOfResidence: varchar("state_of_residence", { length: 256 }).notNull(),
  homeOfficeSqft: integer("home_office_sqft"),
  expectsQbi: boolean("expects_qbi").notNull(),
  retirementContributionAnnual: numeric("retirement_contribution_annual", {
    precision: 10,
    scale: 2,
  }),
  healthInsuranceAnnual: numeric("health_insurance_annual", {
    precision: 10,
    scale: 2,
  }),
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
        table.amountMonthly,
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
    date: date("date").notNull(),
    currencyCode: text("currency_code").notNull(),
    middleRate: numeric("middle_rate", { precision: 14, scale: 6 }).notNull(),
    source: text("source").default("NBS"), // National Bank of Serbia
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      dateCurrencyIdx: uniqueIndex("date_currency_idx").on(
        table.date,
        table.currencyCode,
      ),
    };
  },
);

export const municipalities = pgTable("municipalities", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(), // e.g. "KRUSEVAC"
  name: text("name").notNull(), // "Kruševac"
  pausalCoefficient: numeric("pausal_coefficient", { precision: 10, scale: 2 }),
});

export const activityCodes = pgTable("activity_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 256 }).unique().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  pausalEligible: boolean("pausal_eligible").notNull(),
  defaultCoefficient: numeric("default_coefficient", {
    precision: 10,
    scale: 2,
  }),
});
