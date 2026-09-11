import { TaxProfileOutput } from "@/actions/taxProfile/fetchTaxProfile";
import { frilenserModelA } from "@/domain/regimes/frilenserModelA";
import { frilenserModelB } from "@/domain/regimes/frilenserModelB";
import { calculateKnjigas } from "@/domain/regimes/knjigas";
import { calculatePausal } from "@/domain/regimes/pausal";
import { RegimeResult } from "@/domain/types";

type RegimeCalculator = (
  profile: TaxProfileOutput,
  businessExpenses: number,
  grossAnnual: number,
) => RegimeResult;

const PARAMS_2026 = {
  // Common
  nonTaxableMonthly: 34221,
  contributionBaseMinMonthly: 51297,
  contributionBaseMaxMonthly: 732820,
  pioRateSelfEmployed: 0.24,
  healthRateSelfEmployed: 0.103,
  unemploymentRate: 0.0075,
  incomeTaxRate: 0.2, // 0.20 for Model A, 0.10 for Model B

  // Frilenser
  model1StdDeductionQuarterly: 110647,
  model2FixedDeductionQuarterly: 66733,
  model2PercentageDeduction: 0.34,

  // Employment (if needed later)
  employeePioRate: 0.14,
  employeeHealthRate: 0.0515,
  employeeUnemploymentRate: 0.0075,
  employerPioRate: 0.1,
  employerHealthRate: 0.0515,
};

export const runRegimeCalculator: Record<
  TaxProfileOutput["currentRegime"],
  RegimeCalculator
> = {
  freelancer: (profile, _expenses, grossAnnual) => {
    const model = profile.preferredFrilenserModel;
    if (model !== "A" && model !== "B") {
      throw new Error("Missing frilenser model for user profile");
    }
    const calcFn = model === "A" ? frilenserModelA : frilenserModelB;
    const incomeTaxRate = model === "A" ? 0.2 : 0.1;

    return calcFn({
      alreadyEmployed: profile.alreadyEmployed,
      grossRevenue: grossAnnual / 4,
      isUnder40: profile.isUnder40,
      periodType: "quarter",
      primaryHealthInsuredElsewhere: profile.primaryHealthInsuredElsewhere,
      params: { ...PARAMS_2026, incomeTaxRate },
    });
  },

  pausal: (profile, _expenses, grossAnnual) =>
    calculatePausal({
      officialMonthlyAmount: Number(profile.officialPausalMonthlyAmount),
      monthsInPeriod: 3,
      annualRevenueSoFar: grossAnnual,
      expectedAnnualRevenue: grossAnnual,
    }),

  knjigas: (profile, businessExpenses, grossAnnual) =>
    calculateKnjigas({
      isUnder40: profile.isUnder40,
      personalSalaryGross: Number(profile.personalSalaryGrossMonthly),
      primaryHealthInsuredElsewhere: profile.primaryHealthInsuredElsewhere,
      revenue: grossAnnual / 4,
      businessExpenses,
      params: { ...PARAMS_2026, incomeTaxRate: 0.1 },
    }),

  "d.o.o.": () => {
    throw new Error("DOO regime not yet implemented");
  },
  employee: () => {
    throw new Error("Employment regime not yet implemented");
  },
  hybrid: () => {
    throw new Error("Hybrid regime not yet implemented");
  },
};
