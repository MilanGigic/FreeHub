import { RegimeResult } from "../types";

interface PausalInput {
  officialMonthlyAmount: number; // from the rešenje (or user override)
  monthsInPeriod: number; // usually 3 for quarterly, 12 for yearly
  // optional for warnings
  annualRevenueSoFar?: number;
  expectedAnnualRevenue?: number;
}

export function calculatePausal(input: PausalInput): RegimeResult {
  const { officialMonthlyAmount, monthsInPeriod } = input;

  const totalTax = officialMonthlyAmount * monthsInPeriod;

  return {
    incomeTax: 0, // we don't break it down (or you can later)
    pension: 0,
    health: 0,
    unemployment: 0,
    totalTax,
    taxableBase: 0,
    expensesDeducted: 0,
    effectiveRate: 0, // not meaningful for fixed amount
    warnings: [],
    meta: {
      monthlyAmount: officialMonthlyAmount,
      monthsInPeriod,
    },
  };
}
