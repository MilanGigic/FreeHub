"use server";

import { calculateUSTaxes } from "@/utils/taxCalculatorUS";
import {
  calculateSRBTaxes,
  type SRBTaxInputs,
} from "@/utils/taxCalculatorSRB";
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
  rollingAnnualGross?: number; // for VAT 8M rolling window check
  // KNJIGAS
  monthlyExpenses?: number;
  monthlySalary?: number;
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
    pausalSource?: PausalResolutionSource;
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
      isComputable: pausalSource !== "unknown",
      pausalSource,
    },
  };
}

// ─── Calculator ───────────────────────────────────────────────────────────────

function toSrbTaxInputs(input: SRBTaxInput & { annualGross: string }): SRBTaxInputs {
  const shared = {
    annualGross: Number(input.annualGross),
    isAlreadyEmployed: input.isAlreadyEmployed,
    isUnder40: input.isUnder40,
  };

  switch (input.model) {
    case "MODEL_1":
      return { ...shared, model: "MODEL_1" };
    case "MODEL_2":
      return { ...shared, model: "MODEL_2" };
    case "PAUSAL":
      return {
        ...shared,
        model: "PAUSAL",
        pausalMonthlyBill: input.pausalMonthlyBill,
        rollingAnnualGross: input.rollingAnnualGross,
      };
    case "KNJIGAS":
      return {
        ...shared,
        model: "KNJIGAS",
        monthlyExpenses: input.monthlyExpenses ?? 0,
        monthlySalary: input.monthlySalary,
      };
  }
}

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
      annualRevenue: Number(input.annualGross),
    };
  }

  // ─── Serbia ──────────────────────────────────────────────────────────────────
  // Guard: if meta flagged isComputable: false (pausal with unknown source),
  // pausalMonthlyBill will be undefined here. Do NOT fall back to a hardcoded
  // value — the caller is responsible for not reaching this branch in that case
  // (computeTaxesAction checks meta.isComputable before calling calculateTaxes).
  const result = calculateSRBTaxes(toSrbTaxInputs(input));

  return {
    model: result.model,
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
    modelRecommendation: result.modelRecommendation,
    annualRevenue: Number(input.annualGross),
  };
}

// ─── Format ───────────────────────────────────────────────────────────────────

function formatTaxResult(
  computed: Omit<TaxResult, "netProfit" | "warnings">,
  annualGross: string,
  warnings: string[],
): TaxResult {
  return {
    ...computed,
    netProfit: Number(annualGross),
    warnings,
  };
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
        annualRevenue: 0,
      },
      meta: {
        isComputable: false,
        pausalSource: "unknown",
      },
    };
  }

  const { input, warnings, meta } = await mapProfileToInput(profile);

  // Short-circuit: if the profile is not computable (e.g. pausal with unknown
  // source), return a zeroed result immediately — do not call calculateTaxes.
  if (!meta.isComputable) {
    return {
      result: formatTaxResult(
        {
          model:
            input.country === "SRB" ? (input as SRBTaxInput).model : undefined,
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
            expensesDeducted: 0,
          },
          annualRevenue: 0,
        },
        input.annualGross,
        warnings,
      ),
      meta,
    };
  }

  const computed = calculateTaxes(input);
  const result = formatTaxResult(computed, input.annualGross, warnings);

  return { result, meta };
}
