import { RegimeResult } from "@/domain/types";
import { TaxResult } from "@/lib/store/useTaxProfileStore";
import { Regime } from "@/types/types";

type Period = "month" | "quarter" | "year";

function monthsInPeriod(period: Period): number {
  switch (period) {
    case "month":
      return 1;
    case "quarter":
      return 3;
    case "year":
      return 12;
  }
}

/**
 * Maps a pure RegimeResult into the TaxResult shape the UI/store expects.
 *
 * Contract:
 * - `regimeResult.totalTax` is tax for the SAME period as `periodRevenue`
 * - `periodRevenue` / `periodExpenses` / `periodSalary` are all for that period
 */
export function mapToTaxResult(opts: {
  regime: Regime;
  model?: "A" | "B" | null;
  regimeResult: RegimeResult;
  periodRevenue: number;
  period: Period;
  periodExpenses?: number;
  periodSalary?: number; // knjigas personal salary for the period
}): TaxResult {
  const {
    regime,
    model,
    regimeResult: r,
    periodRevenue,
    period,
    periodExpenses = 0,
    periodSalary = 0,
  } = opts;

  const months = monthsInPeriod(period);
  const periodTax = r.totalTax;

  const profitAfterTaxes =
    regime === "knjigas"
      ? periodRevenue - periodExpenses - periodSalary - periodTax
      : periodRevenue - periodTax;

  const totalAnnualTax = (periodTax / months) * 12;
  const monthlyTaxReserve = periodTax / months;
  const quarterlyEstimate =
    period === "quarter" ? periodTax : (periodTax / months) * 3;

  const annualRevenue = (periodRevenue / months) * 12;

  return {
    regime,
    model: model ?? undefined,
    annualRevenue,
    netProfit: profitAfterTaxes,
    profitAfterTaxes,
    totalAnnualTax,
    monthlyTaxReserve,
    quarterlyEstimate,
    effectiveTaxRate: periodRevenue > 0 ? periodTax / periodRevenue : 0,
    warnings: r.warnings ?? [],
    itemized: {
      incomeTax: r.incomeTax,
      pension: r.pension,
      health: r.health,
      nezaposlenost: r.unemployment,
      expensesDeducted: r.expensesDeducted,
    },
    seTax: 0,
    federalTax: 0,
    qbiDeduction: 0,
  };
}
