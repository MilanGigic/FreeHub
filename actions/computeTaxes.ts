"use server";

import { calculateUSTaxes } from "@/utils/taxCalculatorUS";
import { calculateSRBTaxes } from "@/utils/taxCalculatorSRB";
import { CountryTaxProfile } from "@/actions/taxProfile";
import { SRBModel, TaxResult } from "@/lib/store/useTaxProfileStore";
import { PausalResolutionSource, resolvePausalTax } from "@/lib/pausalResolver";
import { DEFAULT_TAX_COMPUTATION_RESULT } from "@/lib/utils";

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
  model: SRBModel;
  isAlreadyEmployed: boolean;
  isUnder40: boolean;
  // PAUSAL
  pausalMonthlyBill?: number;
  // KNJIGAS
  monthlyExpenses?: number; // actual business costs
  monthlySalary?: number; // owner salary (personalSalaryAmount)
};

type ComputedTaxes = {
  result: TaxResult;
  meta: {
    isComputable: boolean;
    pausalSource?: PausalResolutionSource;
  };
};

export type TaxComputationInput = {
  annualGross: string;
} & (USTaxInput | SRBTaxInput);

function mapSrbRegime(regime: string | null | undefined): SRBModel {
  switch (regime) {
    case "frilenser":
      return "MODEL_1";
    case "pausal":
      return "PAUSAL";
    case "knjigas":
      return "KNJIGAS";
    default:
      return "MODEL_1";
  }
}

export type MapProfileResult = {
  input: TaxComputationInput;
  warnings: string[];
  meta: {
    isComputable: boolean;
    pausalSource?: PausalResolutionSource; // only present for PAUSAL regime
  };
};

export async function mapProfileToInput(
  profile: CountryTaxProfile,
  annualGross?: string,
): Promise<MapProfileResult> {
  const warnings: string[] = [];
  if (!profile) throw new Error("Profile is required");

  if (profile.country === "United States") {
    return {
      input: {
        country: "US",
        annualGross: annualGross ?? "0",
        filingStatus: profile.filingStatus,
        homeOfficeSqft: profile.homeOfficeSqft,
      },
      warnings,
      meta: { isComputable: true },
    };
  }

  // ─── Serbia ───────────────────────────────────────────────────────────────────
  let pausalMonthlyBill: number | undefined;
  let pausalSource: PausalResolutionSource | undefined;

  if (profile.regime === "pausal") {
    if (!profile.pausalActivityCode || !profile.pausalMunicipality) {
      return {
        ...DEFAULT_TAX_COMPUTATION_RESULT,
        meta: { isComputable: false, pausalSource: "unknown" },
      };
    }

    const resolution = await resolvePausalTax({
      activityCode: profile.pausalActivityCode,
      municipality: profile.pausalMunicipality,
      monthlyPausalTax: profile.monthlyPausalTax
        ? Number(profile.monthlyPausalTax)
        : undefined,
    });

    if (resolution.warnings.length > 0)
      resolution.warnings.map((w) => warnings.push(w));

    pausalMonthlyBill = resolution.amount;
    pausalSource = resolution.source;
  }

  return {
    input: {
      country: "SRB",
      annualGross: profile.estimatedAnnualGross ?? "0",
      model: mapSrbRegime(profile.regime),
      isAlreadyEmployed: profile.healthInsuredElsewhere ?? false,
      isUnder40: profile.isUnder40 ?? false,
      pausalMonthlyBill,
      monthlyExpenses: profile.businessExpenses
        ? Number(profile.businessExpenses)
        : undefined,
      monthlySalary: profile.personalSalaryAmount
        ? Number(profile.personalSalaryAmount)
        : undefined,
    },
    warnings,
    meta: {
      // Unknown source means calcPausal will return null — result will be zeroed
      isComputable: pausalSource !== "unknown",
      pausalSource,
    },
  };
}

// ─── Calculator ───────────────────────────────────────────────────────────────

function calculateTaxes(
  input: TaxComputationInput,
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
        expensesDeducted: homeOfficeDeduction,
      },
    };
  }

  // SRB
  const result = calculateSRBTaxes({
    annualGross: Number(input.annualGross),
    model: input.model,
    isAlreadyEmployed: input.isAlreadyEmployed,
    isUnder40: input.isUnder40,
    pausalMonthlyBill: input.pausalMonthlyBill ?? 35000,
    monthlyExpenses: input.monthlyExpenses ?? 0,
    monthlySalary: input.monthlySalary,
  });

  return {
    seTax: 0,
    federalTax: 0,
    qbiDeduction: 0,
    totalAnnualTax: result.totalAnnualTax,
    monthlyTaxReserve: result.monthlyReserve,
    profitAfterTaxes: Number(input.annualGross) - result.totalAnnualTax,
    quarterlyEstimate: result.quarterlyEstimate,
    effectiveTaxRate: result.effectiveTaxRate,
    itemized: {
      incomeTax: result.itemized.incomeTax,
      pension: result.itemized.pio,
      health: result.itemized.health,
      expensesDeducted: result.itemized.expensesDeducted,
    },
  };
}

// ─── Format ───────────────────────────────────────────────────────────────────

function formatTaxResult(
  computed: Omit<TaxResult, "netProfit" | "warnings">,
  annualGross: string,
  warnings: string[],
): TaxResult {
  const formatted = {
    ...computed,
    netProfit: Number(annualGross),
    warnings,
  };
  return formatted;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function computeTaxesAction(
  profile: CountryTaxProfile,
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
        itemized: { incomeTax: 0, pension: 0, health: 0, expensesDeducted: 0 },
      },
      meta: {
        isComputable: false,
        pausalSource: "unknown",
      },
    };
  }

  const { input, warnings, meta } = await mapProfileToInput(profile);

  const computed = calculateTaxes(input);

  const result = formatTaxResult(computed, input.annualGross, warnings);

  return {
    result,
    meta,
  };
}
