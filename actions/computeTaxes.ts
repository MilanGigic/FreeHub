"use server";

import { calculateUSTaxes } from "@/utils/taxCalculatorUS";
import { TaxResult } from "@/lib/store/useTaxProfileStore";
import { PausalResolutionSource } from "@/lib/pausalResolver";
import { runRegimeCalculator } from "@/domain/runRegimeCalculator";
import { RegimeResult } from "@/domain/types";
import { TaxProfileOutput } from "./taxProfile/fetchTaxProfile";

type USTaxInput = {
  country: "US";
  filingStatus: string | null;
  homeOfficeSqft: number | null;
  mileageDeduction?: number;
  healthInsurance?: number;
  retirementContribution?: number;
};

type SRBTaxInput = {
  country: "SRB";
  regime: TaxProfileOutput["currentRegime"];
  model: "A" | "B" | null;
  isAlreadyEmployed: boolean;
  isUnder40: boolean;
  pausalMonthlyBill?: number;
  monthlySalary?: number;
};

export type TaxComputationInput = {
  annualGross: string;
} & (USTaxInput | SRBTaxInput);

type ComputedTaxes = {
  result: TaxResult;
  meta: {
    isComputable: boolean;
    pausalSource?: PausalResolutionSource;
  };
};

type MapProfileResult = {
  input: TaxComputationInput;
  warnings: string[];
  meta: {
    isComputable: boolean;
    pausalSource?: PausalResolutionSource;
  };
};

// ─── Profile → input only (no tax math) ───────────────────────────────────────

export async function mapProfileToInput(
  profile: TaxProfileOutput,
): Promise<MapProfileResult> {
  if (!profile) throw new Error("Profile is required");

  const warnings: string[] = [];

  if (profile.currentRegime === "pausal") {
    const hasAmount = Number(profile.officialPausalMonthlyAmount) > 0;
    if (!hasAmount) {
      return {
        input: {
          country: "SRB",
          annualGross: profile.estimatedAnnualGross ?? "0",
          regime: "pausal",
          model: null,
          isAlreadyEmployed: profile.alreadyEmployed ?? false,
          isUnder40: profile.isUnder40 ?? false,
        },
        warnings: ["Missing official paušal monthly amount from rešenje"],
        meta: { isComputable: false, pausalSource: "unknown" },
      };
    }
  }

  if (profile.currentRegime === "freelancer") {
    const model = profile.preferredFrilenserModel;
    if (model !== "A" && model !== "B") {
      return {
        input: {
          country: "SRB",
          annualGross: profile.estimatedAnnualGross ?? "0",
          regime: "freelancer",
          model: null,
          isAlreadyEmployed: profile.alreadyEmployed ?? false,
          isUnder40: profile.isUnder40 ?? false,
        },
        warnings: ["Missing preferred Frilenser model (A or B)"],
        meta: { isComputable: false },
      };
    }
  }

  return {
    input: {
      country: "SRB",
      annualGross: profile.estimatedAnnualGross ?? "0",
      regime: profile.currentRegime,
      model: profile.preferredFrilenserModel ?? null,
      isAlreadyEmployed: profile.alreadyEmployed ?? false,
      isUnder40: profile.isUnder40 ?? false,
      pausalMonthlyBill: profile.officialPausalMonthlyAmount
        ? Number(profile.officialPausalMonthlyAmount)
        : undefined,
      monthlySalary: profile.personalSalaryGrossMonthly
        ? Number(profile.personalSalaryGrossMonthly)
        : undefined,
    },
    warnings,
    meta: {
      isComputable: true,
      pausalSource: profile.currentRegime === "pausal" ? "user" : undefined,
    },
  };
}

// ─── RegimeResult → TaxResult ─────────────────────────────────────────────────

/**
 * runRegimeCalculator always works on a QUARTER for frilenser/knjigas/pausal
 * (see domain/runRegimeCalculator: grossAnnual/4, monthsInPeriod: 3).
 * So regimeResult.totalTax is a quarterly amount.
 */
function mapRegimeResultToTaxResult(opts: {
  r: RegimeResult;
  profile: TaxProfileOutput;
  /** Revenue passed into the calculator (quarterly for current runRegimeCalculator) */
  periodRevenue: number;
  /** Expenses passed into the calculator (same period) */
  periodExpenses: number;
  annualRevenue: number;
}): Omit<TaxResult, "netProfit" | "warnings"> {
  const { r, profile, periodRevenue, periodExpenses, annualRevenue } = opts;

  // Current runRegimeCalculator is quarterly for all three main regimes
  const monthsInPeriod = 3;
  const totalAnnualTax = (r.totalTax / monthsInPeriod) * 12;
  const monthlyTaxReserve = totalAnnualTax / 12;
  const quarterlyEstimate = r.totalTax; // already one quarter

  const personalSalaryQuarter =
    profile.personalSalaryGrossMonthly != null
      ? Number(profile.personalSalaryGrossMonthly) * 3
      : 0;

  const profitAfterTaxesPeriod =
    profile.currentRegime === "knjigas"
      ? periodRevenue - periodExpenses - personalSalaryQuarter - r.totalTax
      : periodRevenue - r.totalTax;

  return {
    model: profile.preferredFrilenserModel ?? undefined,
    // if TaxResult still has regime field, set it; otherwise omit
    // regime: profile.currentRegime,
    seTax: 0,
    federalTax: 0,
    qbiDeduction: 0,
    totalAnnualTax,
    monthlyTaxReserve,
    quarterlyEstimate,
    profitAfterTaxes: profitAfterTaxesPeriod,
    effectiveTaxRate:
      periodRevenue > 0 ? r.totalTax / periodRevenue : r.effectiveRate,
    itemized: {
      incomeTax: r.incomeTax,
      pension: r.pension,
      health: r.health,
      nezaposlenost: r.unemployment,
      expensesDeducted: r.expensesDeducted,
    },
    modelRecommendation: undefined,
    annualRevenue,
  };
}

// ─── Calculator ───────────────────────────────────────────────────────────────

function calculateTaxes(
  input: TaxComputationInput,
  profile: TaxProfileOutput,
  expenses: number,
  revenue: number,
): Omit<TaxResult, "netProfit" | "warnings"> {
  if (input.country === "US") {
    const homeOfficeDeduction = input.homeOfficeSqft
      ? input.homeOfficeSqft * 5
      : 0;

    const {
      seTax,
      qbi: qbiDeduction,
      federalTax,
    } = calculateUSTaxes({
      netProfit: Number(input.annualGross),
      filingStatus: input.filingStatus,
      homeOfficeDeduction,
      mileageDeduction: input.mileageDeduction,
      healthInsurance: input.healthInsurance,
      retirementContribution: input.retirementContribution,
    });

    const totalAnnualTax = seTax + federalTax;

    return {
      seTax,
      federalTax,
      qbiDeduction,
      totalAnnualTax,
      monthlyTaxReserve: Math.round(totalAnnualTax / 12),
      profitAfterTaxes: Number(input.annualGross) - totalAnnualTax,
      quarterlyEstimate: Math.round(totalAnnualTax / 4),
      effectiveTaxRate:
        Number(input.annualGross) > 0
          ? totalAnnualTax / Number(input.annualGross)
          : 0,
      itemized: {
        incomeTax: federalTax,
        pension: seTax,
        health: 0,
        nezaposlenost: 0,
        expensesDeducted: homeOfficeDeduction,
      },
      annualRevenue: Number(input.annualGross),
    };
  }

  // Serbia — revenue should be ANNUAL here; runRegimeCalculator divides by 4
  const annualRevenue = revenue > 0 ? revenue : Number(input.annualGross) || 0;

  const regimeResult = runRegimeCalculator[profile.currentRegime](
    profile,
    expenses,
    annualRevenue,
  );

  return mapRegimeResultToTaxResult({
    r: regimeResult,
    profile,
    periodRevenue: annualRevenue / 4, // matches freelancer/knjigas/pausal in runRegimeCalculator
    periodExpenses: expenses,
    annualRevenue,
  });
}

function formatTaxResult(
  computed: Omit<TaxResult, "netProfit" | "warnings">,
  warnings: string[],
  regimeWarnings: string[] = [],
): TaxResult {
  return {
    ...computed,
    netProfit: computed.profitAfterTaxes,
    warnings: [...warnings, ...regimeWarnings],
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function computeTaxesAction(
  profile: TaxProfileOutput,
  revenue: number,
  expenses: number,
): Promise<ComputedTaxes> {
  if (!profile) {
    return {
      result: {
        netProfit: 0,
        seTax: 0,
        federalTax: 0,
        qbiDeduction: 0,
        totalAnnualTax: 0,
        monthlyTaxReserve: 0,
        profitAfterTaxes: 0,
        quarterlyEstimate: 0,
        effectiveTaxRate: 0,
        warnings: [],
        itemized: {
          incomeTax: 0,
          pension: 0,
          health: 0,
          expensesDeducted: 0,
          nezaposlenost: 0,
        },
        annualRevenue: 0,
      },
      meta: { isComputable: false, pausalSource: "unknown" },
    };
  }

  const { input, warnings, meta } = await mapProfileToInput(profile);

  if (!meta.isComputable) {
    return {
      result: formatTaxResult(
        {
          seTax: 0,
          federalTax: 0,
          qbiDeduction: 0,
          totalAnnualTax: 0,
          monthlyTaxReserve: 0,
          profitAfterTaxes: 0,
          quarterlyEstimate: 0,
          effectiveTaxRate: 0,
          itemized: {
            incomeTax: 0,
            pension: 0,
            health: 0,
            nezaposlenost: 0,
            expensesDeducted: 0,
          },
          annualRevenue: 0,
        },
        warnings,
      ),
      meta,
    };
  }

  const computed = calculateTaxes(input, profile, expenses, revenue);

  // Optional: pull warnings from a second call is wasteful;
  // better if runRegimeCalculator returns them (already on RegimeResult).
  const regimeResult = runRegimeCalculator[profile.currentRegime](
    profile,
    expenses,
    revenue > 0 ? revenue : Number(input.annualGross) || 0,
  );

  const result = formatTaxResult(computed, warnings, regimeResult.warnings);

  return { result, meta };
}
