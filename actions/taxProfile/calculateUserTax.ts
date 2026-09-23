import { RegimeResult } from "@/domain/types";
import { fetchTaxProfile } from "./fetchTaxProfile";
import { TaxResult } from "@/lib/store/useTaxProfileStore";
import { Regime } from "@/types/types";
import { getRevenueForPeriod } from "../finances/getRevenueForPeriod";
import { getDeductibleExpensesForPeriod } from "../finances/getDeductibleExpensesForPeriod";
import { runRegimeCalculator } from "@/domain/runRegimeCalculator";

export async function calculateUserTax(
  userId: string,
  period: "month" | "quarter" | "year" = "month",
) {
  const profile = await fetchTaxProfile(userId);

  let revenue = await getRevenueForPeriod(userId, period);
  const expenses = await getDeductibleExpensesForPeriod(userId, period);

  if (revenue <= 0 && profile.estimatedAnnualGross) {
    const annual = Number(profile.estimatedAnnualGross);
    revenue =
      period === "quarter"
        ? annual / 4
        : period === "month"
          ? annual / 12
          : annual;
  }

  // runRegimeCalculator expects ANNUAL as 3rd arg today:
  const annualForCalc =
    period === "quarter"
      ? revenue * 4
      : period === "month"
        ? revenue * 12
        : revenue;

  const result = runRegimeCalculator[profile.currentRegime](
    profile,
    expenses,
    annualForCalc,
  );

  const realRevenue =
    revenue === 0 ? Number(profile.estimatedAnnualGross) / 4 : revenue;

  return mapToTaxResult(
    profile.currentRegime,
    profile.preferredFrilenserModel,
    result,
    realRevenue, // period revenue for net profit
    period,
  );
}

function mapToTaxResult(
  regime: Regime,
  model: "A" | "B" | null,
  regimeResult: RegimeResult,
  revenue: number,
  period: "month" | "quarter" | "year",
): TaxResult {
  const months = period === "quarter" ? 3 : 12;

  return {
    regime,
    model: model ?? undefined,
    annualRevenue: period === "year" ? revenue : revenue * 4,
    netProfit: revenue - regimeResult.totalTax,
    totalAnnualTax:
      period === "quarter" ? regimeResult.totalTax * 4 : regimeResult.totalTax,
    monthlyTaxReserve:
      regimeResult.totalTax /
      (period === "quarter" ? 3 : period === "month" ? 1 : 12),
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
