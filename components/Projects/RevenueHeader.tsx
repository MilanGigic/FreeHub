"use client";

import { useProjectStore } from "@/lib/store/useProjectStore";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { convertMinor, formatMinor, safeRate, toMinor } from "@/lib/currency";
import { useRates } from "@/hooks/useRates";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

export default function RevenueHeader({
  displayCurrency,
}: {
  displayCurrency: string;
}) {
  const t = useTranslations("transactions");
  const locale = useLocale();
  const { selectedProject, projectFinances } = useProjectStore();

  const { taxResult } = useTaxProfileStore();
  const rate = safeRate(taxResult.effectiveTaxRate);

  const financeCurrencies = projectFinances?.map((f) => f.currency);
  const rates = useRates([...financeCurrencies!, displayCurrency]);

  const { projectRevenue, projectExpense } = useMemo(() => {
    if (!rates) return { projectRevenue: 0, projectExpense: 0 };
    let revenueMinor = 0;
    let expensesMinor = 0;

    for (const f of projectFinances!) {
      const minor = convertMinor(
        toMinor(f.amount),
        f.currency ?? displayCurrency,
        displayCurrency,
        rates,
      );

      if (f.type === "income") revenueMinor += minor;
      if (f.type === "expense") expensesMinor += minor;
    }

    return {
      projectRevenue: revenueMinor / 100,
      projectExpense: expensesMinor / 100,
    };
  }, [projectFinances, rates, displayCurrency]);

  const taxReservedFromClient = projectRevenue * rate;
  const netTakeHome = projectRevenue - projectExpense - taxReservedFromClient;
  const margin = projectRevenue > 0 ? netTakeHome / projectRevenue : 0;

  if (!selectedProject) return null;

  return (
    <header className="w-full text-center flex flex-col md:flex-row gap-2">
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          {formatMinor(toMinor(projectRevenue), displayCurrency, locale)}
        </p>
        <h1 className="primary-slate tracking-widest">{t("totalRevenue")}</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          {formatMinor(toMinor(projectExpense), displayCurrency, locale)}
        </p>
        <h1 className="primary-slate tracking-widest">{t("totalExpenses")}</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          {formatMinor(toMinor(netTakeHome), displayCurrency, locale)}
        </p>
        <h1 className="primary-slate tracking-widest">{t("netProfit")}</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          {formatMinor(toMinor(rate), displayCurrency, locale)}
        </p>
        <h1 className="primary-slate tracking-widest">{t("effectiveRate")}</h1>
      </div>
    </header>
  );
}
