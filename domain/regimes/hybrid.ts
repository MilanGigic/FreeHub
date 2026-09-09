import { calculateEmployment } from "./employment";
import { frilenserModelA } from "./frilenserModelA";
import { frilenserModelB } from "./frilenserModelB";
import { calculateKnjigas } from "./knjigas";
import { calculatePausal } from "./pausal";

interface HybridInput {
  // Employment
  grossSalary: number;
  periodType: "month" | "quarter";

  // Side activity
  sideRegime: "frilenser_a" | "frilenser_b" | "pausal" | "knjigas";
  sideRevenue: number;
  businessExpenses?: number; // only for knjigas
  officialMonthlyAmount?: number; // only for pausal
  personalSalaryGross?: number | null; // only for knjigas

  // Shared profile
  isUnder40: boolean;
  primaryHealthInsuredElsewhere: boolean;
  params: {
    // Employment
    nonTaxableMonthly: number;
    employeePioRate: number;
    employeeHealthRate: number;
    employeeUnemploymentRate: number;
    employerPioRate: number;
    employerHealthRate: number;

    // Self-employed / Frilenser / Knjigaš
    pioRateSelfEmployed: number;
    healthRateSelfEmployed: number;
    unemploymentRate: number;
    incomeTaxRate: number;
    contributionBaseMinMonthly: number;
    contributionBaseMaxMonthly: number;

    // Frilenser specific
    model1StdDeductionQuarterly: number;
    model2FixedDeductionQuarterly: number;
    model2PercentageDeduction: number;
  };
}

export function calculateHybrid(input: HybridInput) {
  const {
    sideRegime,
    officialMonthlyAmount,
    primaryHealthInsuredElsewhere,
    businessExpenses,
    personalSalaryGross,
    grossSalary,
    periodType,
    isUnder40,
    sideRevenue,
    params,
  } = input;

  // 1. calculate employment tax
  const employmentResult = calculateEmployment({
    grossSalary,
    periodType,
    isUnder40,
    params,
  });

  // 2. calculate side activity tax
  let sideResult;

  if (sideRegime === "frilenser_a") {
    sideResult = frilenserModelA({
      alreadyEmployed: true,
      grossRevenue: sideRevenue,
      isUnder40,
      periodType: "quarter",
      primaryHealthInsuredElsewhere,
      params,
    });
  } else if (sideRegime === "frilenser_b") {
    sideResult = frilenserModelB({
      alreadyEmployed: true,
      grossRevenue: sideRevenue,
      isUnder40,
      periodType: "quarter",
      primaryHealthInsuredElsewhere,
      params,
    });
  } else if (sideRegime === "pausal") {
    if (!officialMonthlyAmount) return null;
    sideResult = calculatePausal({
      monthsInPeriod: periodType === "month" ? 1 : 3,
      officialMonthlyAmount,
      annualRevenueSoFar: sideRevenue,
      expectedAnnualRevenue: sideRevenue,
    });
  } else if (sideRegime === "knjigas") {
    sideResult = calculateKnjigas({
      businessExpenses: businessExpenses ?? 0,
      isUnder40,
      personalSalaryGross: personalSalaryGross ?? null,
      primaryHealthInsuredElsewhere,
      revenue: sideRevenue,
      params,
    });
  }

  if (!sideResult) return;

  // 3. Combine for display
  return {
    employment: employmentResult,
    sideActivity: sideResult,
    totalTax: employmentResult.totalTax + sideResult.totalTax,
    // later: annual surtax on combined income
  };
}
