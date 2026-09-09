import { RegimeInput, RegimeResult } from "../types";

const MIN_PIO_BASE_QUARTERLY = 153_891; // 3 × 51,297
const MIN_HEALTH_BASE_QUARTERLY = 67_989; // 3 × 22,663

export function frilenserModelB(input: RegimeInput): RegimeResult {
  const { grossRevenue, params, primaryHealthInsuredElsewhere } = input;

  // 1. Deductions
  const fixedDeduction = params.model2FixedDeductionQuarterly; // 66_733
  const percentageDeduction = grossRevenue * params.model2PercentageDeduction; // 34%
  const totalDeduction = fixedDeduction + percentageDeduction;

  const taxableBase = Math.max(0, grossRevenue - totalDeduction);

  // 2. Income tax
  const incomeTax = taxableBase * 0.1;

  // 3. PIO – has a mandatory minimum
  const pioBase = Math.max(taxableBase, MIN_PIO_BASE_QUARTERLY); // never below 153_891
  const pension = pioBase * params.pioRateSelfEmployed; // 24%

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
    expensesDeducted: totalDeduction,
    effectiveRate: grossRevenue > 0 ? totalTax / grossRevenue : 0,
    warnings: [],
  };
}
