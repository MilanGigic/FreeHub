"use client";

import { useRates } from "@/hooks/useRates";
import { convertMinor, formatMinor, toMinor } from "@/lib/currency";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

function mostCommon(values: (string | null | undefined)[]): string | null {
  const counts = new Map<string, number>();
  for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export default function InvoiceHeader({
  displayCurrency: preferred,
}: {
  displayCurrency?: string;
}) {
  const { invoices } = useInvoiceStore();
  const t = useTranslations("invoices");
  const locale = useLocale();

  const invoiceCurrencies = invoices.map((inv) => inv.currency);
  const displayCurrency = preferred ?? mostCommon(invoiceCurrencies) ?? "USD"; // "USD" only for an empty list

  const rates = useRates([...invoiceCurrencies, displayCurrency]);

  const totals = useMemo(() => {
    if (!rates) return null;
    let outstanding = 0;
    let overdue = 0;
    let paid = 0;
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
      if (inv.status === "paid") paid += minor;
    }
    return { outstanding, overdue, paid };
  }, [invoices, rates, displayCurrency]);

  const overdueCount = invoices.filter(
    (inv) => inv.status === "overdue",
  ).length;
  const fmt = (minor?: number) =>
    minor === undefined ? "—" : formatMinor(minor, displayCurrency, locale);

  return (
    <header className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          {t("outstanding")}
        </h1>
        <p className="text-2xl font-bold primary-amber flex items-center gap-2">
          {fmt(totals?.outstanding)}{" "}
          <span className="text-sm primary-slate">{t("includingOverdue")}</span>
        </p>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          {t("overdueLabel")}
        </h1>
        <p className="text-2xl font-bold primary-red flex items-center gap-2">
          {fmt(totals?.overdue)}
          <span className="text-sm primary-slate">
            - {overdueCount}{" "}
            {overdueCount > 1 ? t("invoicesPlural") : t("invoice")}{" "}
            {t("overdueSuffix")}
          </span>
        </p>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          {t("totalPaid")}
        </h1>
        <p className="text-2xl font-bold primary-green">{fmt(totals?.paid)}</p>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          {t("averageDaysToPay")}
        </h1>
        <p className="text-2xl font-bold primary-cyan">
          {invoices.length > 0
            ? Math.floor(
                invoices.reduce(
                  (acc, invoice) =>
                    acc +
                    (invoice.status !== "paid"
                      ? (invoice.dueDate.getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                      : 0),
                  0,
                ) / invoices.length,
              )
            : t("noInvoices")}
        </p>
      </div>
    </header>
  );
}
