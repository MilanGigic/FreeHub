"use client";

import { useDataStore } from "@/lib/store/useDataStore";

import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { useAuth } from "@/lib/useAuth";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function FinancesCard({
  displayCurrency: preferred,
}: {
  displayCurrency?: string;
}) {
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
      <div className="border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full text-xl font-bold uppercase text-center">
        {t("loginToViewFinances")}
      </div>
    );

  return (
    <div className="flex flex-col justify-between gap-2 w-full h-full ">
      <div className="flex flex-col">
        <h1 className="text-slate-300 font-semibold text-base sm:text-lg uppercase text-center">
          {numericTotalIncome === 0 &&
            profitMargin === 0 &&
            "This data is from your onboarding. Enter real invoices and transactions."}
        </h1>
        <main className="text-sm flex flex-col gap-4 sm:gap-8">
          <div className="w-full flex flex-col z-0 p-px rounded-lg gap-2">
            <p className="text-sm text-tertiary font-semibold uppercase">
              {t("netProfit")} <span></span>
            </p>
            <p className="font-bold primary-green text-3xl sm:text-5xl lg:text-7xl tracking-wide flex flex-wrap items-end gap-x-2 gap-y-0.5 break-words">
              {Number(taxResult.netProfit.toFixed(2)).toLocaleString()}
              <span className="text-tertiary text-xl sm:text-2xl lg:text-3xl font-semibold">
                RSD
              </span>
            </p>
          </div>
          <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-t background-border">
            <div className="z-0 rounded-lg min-w-0">
              <p className="text-slate-400 text-xs sm:text-sm flex flex-col border-r background-border z-10 bg-black/50 backdrop-blur-2xl py-3 sm:py-4 px-2 sm:px-3">
                {t("ytdIncome")}{" "}
                <span className="font-bold text-primary text-base sm:text-xl break-words">
                  {numericTotalIncome === 0
                    ? taxResult.annualRevenue.toLocaleString()
                    : numericTotalIncome}{" "}
                  RSD
                  {numericTotalIncome === 0 ? (
                    <span className="text-slate-400 text-xs sm:text-sm lowercase tracking-wide">
                      (From onboarding)
                    </span>
                  ) : null}
                </span>
              </p>
            </div>
            <div className="z-0 rounded-lg min-w-0">
              <p className="text-slate-400 text-xs sm:text-sm flex flex-col border-r background-border z-10 bg-black/50 backdrop-blur-2xl py-3 sm:py-4 px-2 sm:px-3">
                {t("expenses")}{" "}
                <span className="font-bold text-primary text-base sm:text-xl break-words">
                  {numericTotalExpenses.toLocaleString()} RSD
                </span>
              </p>
            </div>
            <div className="z-0 rounded-lg min-w-0">
              <p className="text-slate-400 text-xs sm:text-sm flex flex-col border-r background-border z-10 bg-black/50 backdrop-blur-2xl py-3 sm:py-4 px-2 sm:px-3">
                {t("profitMargin")}{" "}
                <span className="font-bold text-primary text-base sm:text-xl break-words">
                  {(taxResult.annualRevenue > 0
                    ? taxResult.profitAfterTaxes / taxResult.annualRevenue
                    : 0
                  ).toFixed(2)}
                  %
                </span>
              </p>
            </div>
            <div className="z-0 rounded-lg min-w-0">
              <p className="text-slate-400 text-xs sm:text-sm flex flex-col border-r background-border z-10 py-3 sm:py-4 px-2 sm:px-3">
                {t("taxReserved")}{" "}
                <span className="font-bold text-primary text-base sm:text-xl break-words">
                  {Number(taxResult.monthlyTaxReserve).toLocaleString()} RSD
                </span>
              </p>
            </div>
            <div className="z-0 rounded-lg min-w-0">
              <p className="text-slate-400 text-xs sm:text-sm flex flex-col z-10 bg-black/50 backdrop-blur-2xl py-3 sm:py-4 px-2 sm:px-3">
                {t("safeToSpend")}{" "}
                <span className="font-bold text-primary text-base sm:text-xl break-words">
                  {Number(safeToSpend.amount).toLocaleString()} RSD
                </span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
