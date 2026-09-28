"use client";

import { CurrencyAmount } from "@/actions/clients/fetchClientsPageMetrics";
import { useRates } from "@/hooks/useRates";
import { convertMinor, formatMinor, toMinor } from "@/lib/currency";
import { useClientStore } from "@/lib/store/useClientStore";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

function mostCommon(values: string[]): string | null {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

/** Sum a list of {currency, amount} groups into minor units of `to`. */
function sumInto(
  groups: CurrencyAmount[],
  to: string,
  rates: Record<string, number>,
): number {
  return groups.reduce(
    (acc, g) => acc + convertMinor(toMinor(g.amount), g.currency, to, rates),
    0,
  );
}

export default function ClientsHeader({
  clientsPageMetrics,
  displayCurrency: preferred,
}: {
  clientsPageMetrics: {
    revenue: CurrencyAmount[];
    expenses: CurrencyAmount[];
    outstanding: CurrencyAmount[];
  };
  displayCurrency?: string;
}) {
  const { clients } = useClientStore();
  const t = useTranslations("clients");
  const locale = useLocale();

  const { revenue, expenses, outstanding } = clientsPageMetrics;

  const allCurrencies = [...revenue, ...expenses, ...outstanding].map(
    (g) => g.currency,
  );

  const displayCurrency = preferred ?? mostCommon(allCurrencies) ?? "RSD";

  const rates = useRates([...allCurrencies, displayCurrency]);

  const totals = useMemo(() => {
    if (!rates) return null;

    return {
      revenue: sumInto(revenue, displayCurrency, rates),
      expenses: sumInto(expenses, displayCurrency, rates),
      outstanding: sumInto(outstanding, displayCurrency, rates),
    };
  }, [rates, revenue, expenses, outstanding, displayCurrency]);

  const fmt = (minor?: number) =>
    minor === undefined ? "—" : formatMinor(minor, displayCurrency, locale);

  return (
    <div className="flex flex-col xl:flex-row gap-4 w-full">
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-purple text-5xl font-bold tracking-widest mb-6">
          {clients.length}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          {t("totalActiveClients")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-green text-5xl font-bold tracking-widest mb-6">
          {/* {fmt(Number(revenueThisMonth))}
           */}
          {fmt(totals?.revenue)}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          {t("revenueThisMonth")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-red text-5xl font-bold tracking-widest mb-6">
          {fmt(totals?.expenses)}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          {t("expensesThisMonth")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-amber text-5xl font-bold tracking-widest mb-6 flex flex-col items-center">
          {fmt(totals?.outstanding)}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          {t("outstandingInvoices")}
        </p>
      </div>
    </div>
  );
}
