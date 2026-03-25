"use client";

import { useClientStore } from "@/lib/store/useClientStore";
import { useTranslations } from "next-intl";

export default function ClientsHeader({
  clientsPageMetrics,
}: {
  clientsPageMetrics: {
    revenueThisMonth: string;
    expensesThisMonth: string;
    outstandingInvoices: string;
  };
}) {
  const { clients } = useClientStore();
  const t = useTranslations("clients");

  const { revenueThisMonth, expensesThisMonth, outstandingInvoices } =
    clientsPageMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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
          ${revenueThisMonth}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          {t("revenueThisMonth")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-red text-5xl font-bold tracking-widest mb-6">
          ${expensesThisMonth}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          {t("expensesThisMonth")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-amber text-5xl font-bold tracking-widest mb-6 flex flex-col items-center">
          ${outstandingInvoices}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          {t("outstandingInvoices")}
        </p>
      </div>
    </div>
  );
}
