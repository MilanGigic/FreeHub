interface TaxResult {
  modelName: string;
  totalTax: number;
  incomeTax: number;
  pension: number;
  health: number;
  taxableBase: number;
}

interface CalculationOutput {
  rsdAmount: number;
  modelA: TaxResult;
  modelB: TaxResult;
  suggestedModel: "model_a" | "model_b";
}

/**
 * Calculates quarterly taxes for Serbian freelancers (2026 Rules)
 * @param foreignAmount - The amount received (e.g., 2000)
 * @param exchangeRate - The NBS Middle Rate for that day (e.g., 107.5)
 * @param healthInsuredElsewhere - Boolean from user profile
 */
export function calculateFreelanceTax(
  foreignAmount: number,
  exchangeRate: number,
  healthInsuredElsewhere: boolean,
): CalculationOutput {
  const rsdAmount = foreignAmount * exchangeRate;

  // 2026 Constants (Quarterly)
  const MOD_A_THRESHOLD = 110647;
  const MOD_B_THRESHOLD = 66733;
  const MOD_B_EXPENSE_RATE = 0.34; // 34%

  const PIO_RATE = 0.24; // 24%
  const HEALTH_RATE = 0.103; // 10.3%
  const MIN_HEALTH_QUARTERLY = 4802; // Minimum health if unemployed

  // --- MODEL A CALCULATION ---
  const baseA = Math.max(0, rsdAmount - MOD_A_THRESHOLD);
  const incomeTaxA = baseA * 0.2; // 20% rate
  const pioA = baseA * PIO_RATE;
  const healthA = healthInsuredElsewhere
    ? 0
    : Math.max(baseA * HEALTH_RATE, MIN_HEALTH_QUARTERLY);

  const modelA: TaxResult = {
    modelName: "Model A (Safety Net)",
    taxableBase: baseA,
    incomeTax: incomeTaxA,
    pension: pioA,
    health: healthA,
    totalTax: incomeTaxA + pioA + healthA,
  };

  // --- MODEL B CALCULATION ---
  // Step 1: Subtract 34% expenses first
  const afterExpenses = rsdAmount * (1 - MOD_B_EXPENSE_RATE);
  // Step 2: Subtract the fixed threshold
  const baseB = Math.max(0, afterExpenses - MOD_B_THRESHOLD);

  const incomeTaxB = baseB * 0.1; // 10% rate
  const pioB = baseB * PIO_RATE;
  const healthB = healthInsuredElsewhere
    ? 0
    : Math.max(baseB * HEALTH_RATE, MIN_HEALTH_QUARTERLY);

  const modelB: TaxResult = {
    modelName: "Model B (High Roller)",
    taxableBase: baseB,
    incomeTax: incomeTaxB,
    pension: pioB,
    health: healthB,
    totalTax: incomeTaxB + pioB + healthB,
  };

  return {
    rsdAmount: Number(rsdAmount.toFixed(2)),
    modelA,
    modelB,
    suggestedModel: modelA.totalTax <= modelB.totalTax ? "model_a" : "model_b",
  };
}

// How to use it with your database:

// const rate = await db.query.dailyExchangeRates.findFirst({
//   where: (rates, { and, eq }) => and(eq(rates.date, invoiceDate), eq(rates.currencyCode, "USD"))
// });

// const results = calculateFreelanceTax(
//   invoiceAmount,
//   Number(rate.middleRate),
//   userProfile.healthInsuredElsewhere
// );

// console.log(`You should pick ${results.suggestedModel}!`);
