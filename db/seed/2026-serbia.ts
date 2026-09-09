import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { taxParameters, taxYears } from "@/db/schema";
import { pathToFileURL } from "url";

type TaxParameterValue =
  | { type: "number"; value: number }
  | { type: "percentage"; value: number }
  | { type: "string"; value: string };

interface TaxParameterSeed {
  key: string;
  category: string;
  value: TaxParameterValue;
  notes?: string;
}

const COUNTRY = "RS" as const;
const YEAR = 2026;

const TAX_PARAMETERS_SRB_2026: TaxParameterSeed[] = [
  // --- Income tax & non-taxable amounts ---
  {
    key: "non_taxable_monthly",
    category: "income_tax",
    value: { type: "number", value: 34221 },
    notes: "RSD, full-time",
  },
  {
    key: "income_tax_rate_employment",
    category: "income_tax",
    value: { type: "percentage", value: 0.1 },
  },
  {
    key: "income_tax_rate_self_employment",
    category: "income_tax",
    value: { type: "percentage", value: 0.1 },
    notes: "knjigaš / actual",
  },
  {
    key: "income_tax_rate_capital_gains",
    category: "income_tax",
    value: { type: "percentage", value: 0.15 },
  },
  {
    key: "income_tax_rate_rental",
    category: "income_tax",
    value: { type: "percentage", value: 0.2 },
  },
  {
    key: "income_tax_rate_other",
    category: "income_tax",
    value: { type: "percentage", value: 0.2 },
  },

  // --- Social contributions ---
  {
    key: "pio_rate_employee",
    category: "social_contributions",
    value: { type: "percentage", value: 0.14 },
  },
  {
    key: "pio_rate_employer",
    category: "social_contributions",
    value: { type: "percentage", value: 0.1 },
  },
  {
    key: "pio_rate_self_employed",
    category: "social_contributions",
    value: { type: "percentage", value: 0.24 },
  },
  {
    key: "health_rate",
    category: "social_contributions",
    value: { type: "percentage", value: 0.0515 },
    notes: "employee/employer",
  },
  {
    key: "health_rate_self_employed",
    category: "social_contributions",
    value: { type: "percentage", value: 0.103 },
  },
  {
    key: "unemployment_rate",
    category: "social_contributions",
    value: { type: "percentage", value: 0.0075 },
  },
  {
    key: "contribution_base_min_monthly",
    category: "social_contributions",
    value: { type: "number", value: 51297 },
  },
  {
    key: "contribution_base_max_monthly",
    category: "social_contributions",
    value: { type: "number", value: 732820 },
  },
  {
    key: "contribution_base_max_annual",
    category: "social_contributions",
    value: { type: "number", value: 8793840 },
  },

  // --- Frilenser (unregistered) – Model A / Model B ---
  {
    key: "frilenser_model1_std_deduction_quarterly",
    category: "frilenser",
    value: { type: "number", value: 110647 },
    notes: "2026 figure",
  },
  {
    key: "frilenser_model1_tax_rate",
    category: "frilenser",
    value: { type: "percentage", value: 0.2 },
  },
  {
    key: "frilenser_model2_fixed_deduction_quarterly",
    category: "frilenser",
    value: { type: "number", value: 66733 },
  },
  {
    key: "frilenser_model2_percentage_deduction",
    category: "frilenser",
    value: { type: "percentage", value: 0.34 },
  },
  {
    key: "frilenser_model2_tax_rate",
    category: "frilenser",
    value: { type: "percentage", value: 0.1 },
  },
  {
    key: "frilenser_health_min_quarterly",
    category: "frilenser",
    value: { type: "number", value: 7003 },
    notes: "approximate – confirm exact",
  },

  // --- Paušal & thresholds ---
  {
    key: "pausal_revenue_limit_annual",
    category: "pausal_thresholds",
    value: { type: "number", value: 6000000 },
    notes: "calendar year",
  },
  {
    key: "vat_threshold_rolling_12m",
    category: "pausal_thresholds",
    value: { type: "number", value: 8000000 },
  },
  {
    key: "pausal_growth_cap",
    category: "pausal_thresholds",
    value: { type: "percentage", value: 0.1 },
    notes: "annual growth limit on base (if still applicable)",
  },

  // --- Annual surtax (godišnji porez) ---
  {
    key: "surtax_threshold_3x",
    category: "annual_surtax",
    value: { type: "number", value: 5439096 },
    notes: "3 × average annual salary (2025 income example)",
  },
  {
    key: "surtax_threshold_6x",
    category: "annual_surtax",
    value: { type: "number", value: 10878192 },
  },
  {
    key: "surtax_rate_band1",
    category: "annual_surtax",
    value: { type: "percentage", value: 0.1 },
  },
  {
    key: "surtax_rate_band2",
    category: "annual_surtax",
    value: { type: "percentage", value: 0.15 },
  },
  {
    key: "surtax_personal_deduction",
    category: "annual_surtax",
    value: { type: "number", value: 725213 },
    notes: "40% of average",
  },
  {
    key: "surtax_dependent_deduction",
    category: "annual_surtax",
    value: { type: "number", value: 271955 },
    notes: "15% of average",
  },
  {
    key: "surtax_youth_extra_deduction",
    category: "annual_surtax",
    value: { type: "number", value: 5439096 },
    notes: "under 40, 3× average",
  },

  // --- Corporate / other ---
  {
    key: "corporate_tax_rate",
    category: "corporate_other",
    value: { type: "percentage", value: 0.15 },
  },
  {
    key: "dividend_withholding_resident",
    category: "corporate_other",
    value: { type: "percentage", value: 0.15 },
  },
  {
    key: "dividend_withholding_non_resident",
    category: "corporate_other",
    value: { type: "percentage", value: 0.2 },
  },
  {
    key: "vat_standard_rate",
    category: "corporate_other",
    value: { type: "percentage", value: 0.2 },
  },
  {
    key: "vat_reduced_rate",
    category: "corporate_other",
    value: { type: "percentage", value: 0.1 },
  },

  // --- Helper / metadata ---
  {
    key: "average_monthly_salary",
    category: "helper_metadata",
    value: { type: "number", value: 146564 },
    notes: "used to derive many thresholds",
  },
  {
    key: "average_annual_salary",
    category: "helper_metadata",
    value: { type: "number", value: 1813032 },
  },
  {
    key: "currency",
    category: "helper_metadata",
    value: { type: "string", value: "RSD" },
  },
];

/**
 * Finds the RS/2026 tax year row, creating it if it doesn't exist yet.
 * Does NOT touch isCurrent on other rows — that's a separate, deliberate
 * operation you likely want to control explicitly (e.g. a "promote year"
 * script), not something a parameter seed should decide as a side effect.
 */
async function findOrCreateTaxYear(): Promise<string> {
  const inserted = await db
    .insert(taxYears)
    .values({
      country: COUNTRY,
      year: YEAR,
      isCurrent: false, // deliberately not auto-promoted; see note above
    })
    .onConflictDoNothing({ target: [taxYears.country, taxYears.year] })
    .returning({ id: taxYears.id });

  if (inserted.length > 0) {
    return inserted[0].id;
  }

  // Row already existed (that's why the insert no-opped) — fetch its id.
  const existing = await db
    .select({ id: taxYears.id })
    .from(taxYears)
    .where(and(eq(taxYears.country, COUNTRY), eq(taxYears.year, YEAR)))
    .limit(1);

  if (existing.length === 0) {
    // Should be unreachable, but fail loudly instead of returning undefined
    // and silently corrupting every downstream insert like last time.
    throw new Error(
      `Could not find or create tax year row for ${COUNTRY} ${YEAR}`,
    );
  }

  return existing[0].id;
}

async function upsertTaxParameter(taxYearId: string, param: TaxParameterSeed) {
  const description = param.notes
    ? `[${param.category}] ${param.notes}`
    : `[${param.category}]`;

  await db
    .insert(taxParameters)
    .values({
      taxYearId,
      key: param.key,
      value: param.value,
      description,
    })
    .onConflictDoUpdate({
      target: taxParameters.key,
      set: { taxYearId, value: param.value, description },
    });
}

export async function seedTaxParametersSRB2026() {
  console.log(`Resolving tax year row for ${COUNTRY} ${YEAR}...`);
  const taxYearId = await findOrCreateTaxYear();

  console.log(
    `Seeding ${TAX_PARAMETERS_SRB_2026.length} tax parameters under tax_year_id=${taxYearId}...`,
  );

  for (const param of TAX_PARAMETERS_SRB_2026) {
    await upsertTaxParameter(taxYearId, param);
  }

  console.log("Done.");
}

const isMainModule =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  seedTaxParametersSRB2026()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed failed:", err);
      process.exit(1);
    });
}
