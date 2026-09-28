import { RegimeResult } from "@/domain/types";
import { fetchTaxProfile } from "./fetchTaxProfile";
import { TaxResult } from "@/lib/store/useTaxProfileStore";
import { Regime } from "@/types/types";
import { getRevenueForPeriod } from "../finances/getRevenueForPeriod";
import { getDeductibleExpensesForPeriod } from "../finances/getDeductibleExpensesForPeriod";
import { runRegimeCalculator } from "@/domain/runRegimeCalculator";

const MIN_REVENUE_FRACTION = 0.1;

export async function calculateUserTax(
  userId: string,
  period: "month" | "quarter" | "year" = "month",
) {
  const profile = await fetchTaxProfile(userId);

  const invoiceRevenue = await getRevenueForPeriod(userId, period);
  const expenses = await getDeductibleExpensesForPeriod(userId, period);

  const estimatedPeriodRevenue =
    Number(profile.estimatedAnnualGross || 0) /
    (period === "quarter" ? 4 : period === "month" ? 12 : 1);

  const revenue =
    invoiceRevenue >= estimatedPeriodRevenue * MIN_REVENUE_FRACTION
      ? invoiceRevenue
      : Math.max(invoiceRevenue, estimatedPeriodRevenue);

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

  return mapToTaxResult(
    profile.currentRegime,
    profile.preferredFrilenserModel,
    result,
    revenue, // period revenue for net profit
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
  const rawRate = revenue > 0 ? regimeResult.totalTax / revenue : 0;
  const effectiveTaxRate = rawRate > 0 && rawRate < 1 ? rawRate : 0;
  const warnings = [...regimeResult.warnings];
  if (revenue > 0 && (rawRate <= 0 || rawRate >= 1)) {
    warnings.push(
      `Effective tax rate (${(rawRate * 100).toFixed(1)}%) was out of a sane range and was clamped to 0 — revenue base may be too small to be reliable.`,
    );
  }
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
    effectiveTaxRate,
    warnings,
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
