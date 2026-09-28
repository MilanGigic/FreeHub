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

export default function OutstandingInvoices({
  displayCurrency: preferred,
}: {
  displayCurrency?: string;
}) {
  const { invoices } = useInvoiceStore();
  const t = useTranslations("clients");
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
  const fmt = (minor?: number) =>
    minor === undefined ? "—" : formatMinor(minor, displayCurrency, locale);

  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <div className="">
        <h1 className="text-base primary-slate uppercase font-semibold">
          {t("outstandingInvoicesTitle")}
        </h1>
        <p className="text-2xl font-bold primary-amber">
          {fmt(totals?.outstanding)}
        </p>
        <p className="text-sm primary-slate">
          {t("outstandingInvoicesDescription")}
        </p>
      </div>
      <div className="border-b-2 background-border w-full"></div>
      <div>
        <h1 className="text-base primary-slate uppercase font-semibold">
          {t("overdueInvoices")}
        </h1>
        <p className="text-2xl font-bold primary-red flex items-center gap-2">
          {fmt(totals?.overdue)} -{" "}
          <span className="text-sm primary-slate">
            ({overdueCount} {t("invoicesOverdue")})
          </span>
        </p>
        <p className="text-sm primary-slate">
          {t("overdueInvoicesDescription")}
        </p>
      </div>
    </div>
  );
}
