export type Money = number; // always in RSD

export interface RegimeInput {
  // Common
  grossRevenue: Money; // for the period (quarter or year)
  periodType: "quarter" | "year";
  isUnder40: boolean;
  primaryHealthInsuredElsewhere: boolean;
  alreadyEmployed: boolean;

  // Parameters (already resolved)
  params: {
    nonTaxableMonthly: number;
    contributionBaseMinMonthly: number;
    contributionBaseMaxMonthly: number;
    pioRateSelfEmployed: number; // 0.24
    healthRateSelfEmployed: number; // 0.103
    unemploymentRate: number; // 0.0075
    incomeTaxRate: number; // usually 0.10
    // Frilenser specific
    model1StdDeductionQuarterly: number;
    model2FixedDeductionQuarterly: number;
    model2PercentageDeduction: number;
  };
}

export interface RegimeResult {
  incomeTax: Money;
  pension: Money; // PIO
  health: Money;
  unemployment: Money;
  totalTax: Money;
  taxableBase: Money;
  expensesDeducted: Money;
  effectiveRate: number;
  warnings: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>; // optional debug info
}
