import { runRegimeCalculator } from "@/domain/runRegimeCalculator";
import { getDeductibleExpensesForPeriod } from "./finances/getDeductibleExpensesForPeriod";
import { getRevenueForPeriod } from "./finances/getRevenueForPeriod";
import { fetchTaxProfile } from "./taxProfile/fetchTaxProfile";
import { mapToTaxResult } from "./mapToTaxResult";
import { monthsInPeriod } from "@/lib/getPeriodForRegime";

export async function calculateUserTax(userId: string) {
  const profile = await fetchTaxProfile(userId);

  const period = profile.currentRegime === "freelancer" ? "quarter" : "month";

  const periodRevenue = await getRevenueForPeriod(userId, period);
  const periodExpenses = await getDeductibleExpensesForPeriod(userId, period);

  const periodSalary =
    profile.currentRegime === "knjigas" && profile.personalSalaryGrossMonthly
      ? Number(profile.personalSalaryGrossMonthly) * monthsInPeriod(period)
      : 0;

  // If runRegimeCalculator still expects annual:
  const annualForCalc = periodRevenue * (12 / monthsInPeriod(period));

  const regimeResult = runRegimeCalculator[profile.currentRegime](
    profile,
    periodExpenses,
    annualForCalc,
  );

  return mapToTaxResult({
    regime: profile.currentRegime,
    model: profile.preferredFrilenserModel,
    regimeResult,
    periodRevenue,
    period,
    periodExpenses,
    periodSalary,
  });
}
