"use client";

import { useDataStore } from "@/lib/store/useDataStore";

import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { useAuth } from "@/lib/useAuth";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function FinancesCard() {
  const { projects } = useDataStore();
  const { user } = useAuth();

  const { taxResult, safeToSpend, computeSafeToSpend } = useTaxProfileStore(); // Extend store with income/expenses
  const { avgMonthlyExpenses } = useDataStore();
  const t = useTranslations("dashboard");

  useEffect(() => {
    const liveBalance = projects.reduce(
      (acc, project) => acc + Number(project.totalProfit || 0),
      0,
    );

    const annual = Number(taxResult.annualRevenue ?? 0);
    const monthlyRevenue = annual / 12;
    const monthlyTax = taxResult.monthlyTaxReserve ?? 0;

    const currentBalance =
      liveBalance > 0 ? liveBalance : Math.max(0, monthlyRevenue - monthlyTax);

    const expenses =
      Number(avgMonthlyExpenses) > 0
        ? Number(avgMonthlyExpenses)
        : monthlyRevenue * 0.15;

    computeSafeToSpend({
      currentBalance,
      avgMonthlyExpenses: expenses,
    });
  }, [
    projects,
    avgMonthlyExpenses,
    taxResult?.annualRevenue,
    taxResult.monthlyTaxReserve,
    computeSafeToSpend,
  ]);

  const numericTotalIncome = projects.reduce(
    (acc, p) => acc + Number(p.totalRevenue || 0),
    0,
  );
  const numericTotalExpenses = projects.reduce(
    (acc, p) => acc + Number(p.totalExpenses || 0),
    0,
  );
  const profitMargin =
    numericTotalIncome > 0
      ? ((taxResult.netProfit / numericTotalIncome) * 100).toFixed(1)
      : 0;

  if (!user)
    return (
      <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg h-full">
        <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full text-xl font-bold uppercase text-center">
          {t("loginToViewFinances")}
        </div>
      </div>
    );

  return (
    <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg primary-slate h-full">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full">
        <header className="w-full text-2xl font-bold text-primary text-center uppercase flex flex-col border-b-2 background-border pb-4">
          <h1>{t("financesOverview")}</h1>
        </header>

        <div className="flex flex-col  gap-4">
          <h1 className="text-slate-300 font-semibold text-lg uppercase text-center">
            {numericTotalIncome === 0 &&
              profitMargin === 0 &&
              "This data is from your onboarding. Enter real invoices and transactions."}
          </h1>
          <main className="space-y-1.5 text-sm flex flex-col items-center">
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("ytdIncome")}{" "}
              <span className="font-bold primary-green">
                {numericTotalIncome === 0
                  ? taxResult.annualRevenue.toLocaleString()
                  : numericTotalIncome}{" "}
                RSD
                {numericTotalIncome === 0 ? (
                  <span className="text-slate-400 text-sm lowercase tracking-wide text-center">
                    (From onboarding)
                  </span>
                ) : null}
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("expenses")}{" "}
              <span className="font-bold primary-red">
                {numericTotalExpenses.toLocaleString()} RSD
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("netProfit")}{" "}
              <span className="font-bold primary-green">
                {Number(taxResult.netProfit).toLocaleString()} RSD
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("profitMargin")}{" "}
              <span className="font-bold">
                {(taxResult.annualRevenue > 0
                  ? taxResult.profitAfterTaxes / taxResult.annualRevenue
                  : 0
                ).toFixed(2)}
                %
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("taxReserved")}{" "}
              <span className="font-bold primary-amber">
                {Number(taxResult.monthlyTaxReserve).toLocaleString()} RSD
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("safeToSpend")}{" "}
              <span className="font-bold primary-cyan">
                {Number(safeToSpend.amount).toLocaleString()} RSD
              </span>
            </p>
          </main>
        </div>
        <Link
          href="/finances"
          className="text-primary underline w-full flex items-center justify-center gap-2 text-2xl font-bold uppercase hover:text-(--accent-cyan) transition-colors duration-300"
        >
          {t("goToFinances")}
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
