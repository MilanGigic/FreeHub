"use server";

import { computeTaxesAction } from "@/actions/computeTaxes";
import { getDeductibleExpensesForPeriod } from "@/actions/finances/getDeductibleExpensesForPeriod";
import { getRevenueForPeriod } from "@/actions/finances/getRevenueForPeriod";
import { fetchTaxProfile } from "@/actions/taxProfile/fetchTaxProfile";
import FinancesClient from "@/components/Finances/FinancesClient";
import { getDefaultPeriodForRegime } from "@/lib/getPeriodForRegime";
import { getSession } from "@/lib/session";
import { getTranslations } from "next-intl/server";

export default async function FinancesPage() {
  const session = await getSession();

  if (!session) return null;

  const userId = session.userId;
  if (!session?.userId) {
    const t = await getTranslations("auth");
    return (
      <div className="text-center text-primary font-semibold">
        {t("mustBeLoggedIn")}
      </div>
    );
  }

  const profile = await fetchTaxProfile(userId);

  const period = getDefaultPeriodForRegime(profile.currentRegime);

  const revenue = await getRevenueForPeriod(userId, period);
  const expenses = await getDeductibleExpensesForPeriod(userId, period);

  const taxComputation = await computeTaxesAction(profile, revenue, expenses);

  return (
    <FinancesClient
      initialTaxResult={taxComputation.result}
      initialTaxMeta={taxComputation.meta}
    />
  );
}
