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

  const { netProfit, monthlyTaxReserve, safeToSpend, computeSafeToSpend } =
    useTaxProfileStore(); // Extend store with income/expenses
  const { avgMonthlyExpenses } = useDataStore();
  const t = useTranslations("dashboard");

  useEffect(() => {
    const currentBalance = projects.reduce(
      (acc, project) => acc + Number(project.totalProfit || 0),
      0,
    );

    computeSafeToSpend({
      currentBalance,
      avgMonthlyExpenses: Number(avgMonthlyExpenses),
    });
  }, [projects, computeSafeToSpend, avgMonthlyExpenses]);

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
      ? ((netProfit / numericTotalIncome) * 100).toFixed(1)
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
          <main className="space-y-1.5 text-sm flex flex-col items-center">
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("ytdIncome")}{" "}
              <span className="font-bold primary-green">
                ${numericTotalIncome.toLocaleString()}
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("expenses")}{" "}
              <span className="font-bold primary-red">
                ${numericTotalExpenses.toLocaleString()}
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("netProfit")}{" "}
              <span className="font-bold primary-green">
                ${Number(netProfit).toLocaleString()}
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("profitMargin")}{" "}
              <span className="font-bold">{profitMargin}%</span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("taxReserved")}{" "}
              <span className="font-bold primary-amber">
                ${Number(monthlyTaxReserve).toLocaleString()}
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("safeToSpend")}{" "}
              <span className="font-bold primary-cyan">
                ${Number(safeToSpend).toLocaleString()}
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
