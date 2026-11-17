"use client";

import { useClientStore } from "@/lib/store/useClientStore";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useAuth } from "@/lib/useAuth";
import { Dot } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRates } from "@/hooks/useRates";
import { useMemo } from "react";
import { convertMinor, formatMinor, toMinor } from "@/lib/currency";

function mostCommon(values: (string | null | undefined)[]): string | null {
  const counts = new Map<string, number>();
  for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export default function ClientsCard({
  displayCurrency: preferred,
}: {
  displayCurrency?: string;
}) {
  const { user } = useAuth();
  const t = useTranslations("dashboard");
  const { clients } = useClientStore();
  const { invoices } = useInvoiceStore();

  const locale = useLocale();

  const invoiceCurrencies = invoices.map((inv) => inv.currency);
  const displayCurrency = preferred ?? mostCommon(invoiceCurrencies) ?? "USD"; // "USD" only for an empty list

  const rates = useRates([...invoiceCurrencies, displayCurrency]);

  const totals = useMemo(() => {
    if (!rates) return null;
    let outstanding = 0;
    let overdue = 0;
    for (const inv of invoices) {
      const minor = convertMinor(
        toMinor(inv.totalAmount),
        inv.currency ?? displayCurrency,
        displayCurrency,
        rates,
      );

      if (inv.status === "sent" || inv.status === "overdue")
        outstanding += minor;
      if (inv.status === "overdue") overdue += minor;
    }
    return { outstanding, overdue };
  }, [invoices, rates, displayCurrency]);

  const overdueCount = invoices.filter(
    (inv) => inv.status === "overdue",
  ).length;
  const outstandingCount = invoices.filter(
    (inv) => inv.status === "sent" || inv.status === "overdue",
  ).length;
  const fmt = (minor?: number) =>
    minor === undefined ? "—" : formatMinor(minor, displayCurrency, locale);

  if (!user)
    return (
      <div className="border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full text-xl font-bold uppercase text-center">
        {t("loginToViewClients")}
      </div>
    );

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <p className="text-slate-400 text-sm flex flex-col min-w-0">
        {t("clients")}{" "}
        <span className="font-bold text-primary text-lg sm:text-xl">
          {clients.length}
        </span>
      </p>
      <p className="text-slate-400 text-sm flex flex-col min-w-0">
        {t("outstandingInvoices")}
        <span className="font-bold text-primary text-lg sm:text-xl flex flex-wrap items-center gap-x-1">
          {fmt(totals?.outstanding)}
          <span className="text-slate-400 text-xs sm:text-sm font-normal flex items-center">
            <Dot width={16} height={16} /> {outstandingCount} {t("invoices")}
          </span>
        </span>
      </p>
      <p className="text-slate-400 text-sm flex flex-col min-w-0">
        {t("overdueInvoices")}{" "}
        <span className="font-bold text-primary text-lg sm:text-xl flex flex-wrap items-center gap-x-1">
          {fmt(totals?.overdue)} RSD
          <span className="text-slate-400 text-xs sm:text-sm font-normal flex items-center">
            <Dot width={16} height={16} /> {overdueCount} {t("invoices")}
          </span>
        </span>
      </p>
    </div>
  );
}
