"use client";

import { useClientStore } from "@/lib/store/useClientStore";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useAuth } from "@/lib/useAuth";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ClientsCard() {
  const { user } = useAuth();
  const t = useTranslations("dashboard");
  const { clients } = useClientStore();
  const { allOutstandingInvoices, allOverdueInvoices } = useInvoiceStore();

  if (!user)
    return (
      <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg h-full">
        <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full text-xl font-bold uppercase text-center">
          {t("loginToViewClients")}
        </div>
      </div>
    );

  return (
    <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg h-full">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full">
        <header className="w-full text-2xl font-bold text-primary text-center uppercase flex flex-col border-b-2 background-border pb-4">
          <h1>{t("clientsOverview")}</h1>
        </header>
        <main className="flex flex-col gap-2 space-y-1.5 text-sm items-center">
          <p className="text-lg primary-slate font-semibold uppercase">
            {t("clients")}{" "}
            <span className="font-bold primary-green">{clients.length}</span>
          </p>
          <p className="flex items-center gap-2 text-lg primary-slate font-semibold uppercase">
            {t("outstandingInvoices")}{" "}
            <span className="font-bold primary-amber flex items-center gap-2">
              ${allOutstandingInvoices.data} -{" "}
              <span className="text-sm primary-slate">
                {allOutstandingInvoices.count} {t("invoices")}
              </span>
            </span>
          </p>
          <p className="flex items-center gap-2 text-lg primary-slate font-semibold uppercase">
            {t("overdueInvoices")}{" "}
            <span className="font-bold primary-red flex items-center gap-2">
              ${allOverdueInvoices.data} -{" "}
              <span className="text-sm primary-slate">
                {allOverdueInvoices.count} {t("invoices")}
              </span>
            </span>
          </p>
          <p className="text-lg primary-slate font-semibold uppercase text-center w-full">
            {t("topClientContributions")}
          </p>
        </main>

        <Link
          href="/clients"
          className="text-primary underline w-full flex items-center justify-center gap-2 text-2xl font-bold uppercase hover:text-(--accent-cyan) transition-colors duration-300"
        >
          {t("goToClients")}
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
