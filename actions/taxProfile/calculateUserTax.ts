import { RegimeResult } from "@/domain/types";
import { fetchTaxProfile } from "./fetchTaxProfile";
import { TaxResult } from "@/lib/store/useTaxProfileStore";
import { Regime } from "@/types/types";
import { getRevenueForPeriod } from "../finances/getRevenueForPeriod";
import { getDeductibleExpensesForPeriod } from "../finances/getDeductibleExpensesForPeriod";
import { runRegimeCalculator } from "@/domain/runRegimeCalculator";

export async function calculateUserTax(
  userId: string,
  period: "quarter" | "year" = "quarter",
) {
  const profile = await fetchTaxProfile(userId);

  const revenue = await getRevenueForPeriod(userId, period);

  const expenses = await getDeductibleExpensesForPeriod(userId, period);

  const result = runRegimeCalculator[profile.currentRegime](
    profile,
    expenses,
    revenue,
  );

  //   // 4. Map to the shape your UI already uses (TaxResult)
  return mapToTaxResult(profile.currentRegime, result, revenue, period);
}

function mapToTaxResult(
  model: SRBModel,
  regimeResult: RegimeResult,
  revenue: number,
  period: "quarter" | "year",
): TaxResult {
  const months = period === "quarter" ? 3 : 12;

  return {
    model,
    annualRevenue: period === "year" ? revenue : revenue * 4,
    netProfit: revenue - regimeResult.totalTax,
    totalAnnualTax:
      period === "quarter" ? regimeResult.totalTax * 4 : regimeResult.totalTax,
    monthlyTaxReserve: regimeResult.totalTax / months,
    profitAfterTaxes: revenue - regimeResult.totalTax,
    quarterlyEstimate:
      period === "quarter" ? regimeResult.totalTax : regimeResult.totalTax / 4,
    effectiveTaxRate: revenue > 0 ? regimeResult.totalTax / revenue : 0,
    warnings: regimeResult.warnings,
    itemized: {
      incomeTax: regimeResult.incomeTax,
      pension: regimeResult.pension,
      health: regimeResult.health,
      nezaposlenost: regimeResult.unemployment,
      expensesDeducted: regimeResult.expensesDeducted,
    },
    // US fields stay 0 for Serbia
    seTax: 0,
    federalTax: 0,
    qbiDeduction: 0,
  };
}
