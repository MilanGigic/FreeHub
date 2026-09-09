import { RegimeInput, RegimeResult } from "../types";

const MIN_HEALTH_BASE_QUARTERLY = 67_989; // 3 × 22,663

export function frilenserModelA(input: RegimeInput): RegimeResult {
  const { grossRevenue, params, primaryHealthInsuredElsewhere } = input;

  // 1. Taxable base
  const deduction = params.model1StdDeductionQuarterly; // 110_647
  const taxableBase = Math.max(0, grossRevenue - deduction);

  // 2. Income tax
  const incomeTax = taxableBase * 0.2;

  // 3. PIO – can be zero
  const pension = taxableBase * params.pioRateSelfEmployed; // 24%

  // 4. Health – has a minimum
  let health = 0;
  if (!primaryHealthInsuredElsewhere) {
    const healthBase = Math.max(taxableBase, MIN_HEALTH_BASE_QUARTERLY);
    health = healthBase * params.healthRateSelfEmployed; // 10.3%
  }

  const totalTax = incomeTax + pension + health;

  return {
    incomeTax,
    pension,
    health,
    unemployment: 0,
    totalTax,
    taxableBase,
    expensesDeducted: deduction,
    effectiveRate: grossRevenue > 0 ? totalTax / grossRevenue : 0,
    warnings: [],
  };
}
