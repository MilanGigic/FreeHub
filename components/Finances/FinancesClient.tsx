"use client";

import { computeTaxesAction } from "@/actions/computeTaxes";
import { CountryTaxProfile } from "@/actions/taxProfile";
import FinancesHero from "@/components/Finances/FinancesHero";
import CashFlow from "@/components/Finances/Main/Overview/CashFlow";
import GoalsCardClient from "@/components/Finances/Main/Overview/GoalsCardClient";
import ProjectProfitability from "@/components/Finances/Main/Overview/ProjectProfitability";
import RecentTransactions from "@/components/Finances/Main/Overview/RecentTransactions";
import TransactionSimulator from "@/components/Finances/Main/Overview/TransactionSimulator";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TaxesTab from "./Main/Taxes/TaxesTab";

const tabs = ["Details", "Taxes", "Transactions"];

type Props = {
  snapshot: {
    annualNetProfit: number;
    expectedIncomeNext30Days: number;
    avgMonthlyExpenses: number;
  };
  profile: CountryTaxProfile;
  currentBalance: number;
};

export default function FinancesClient({
  snapshot,
  profile,
  currentBalance,
}: Props) {
  const { setTaxResult, computeSafeToSpend, monthlyTaxReserve } =
    useTaxProfileStore();

  const [taxMeta, setTaxMeta] = useState<{
    isComputable: boolean;
    pausalSource?: "official" | "user" | "unknown";
  }>({ isComputable: true });

  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const result = await computeTaxesAction(
          profile,
          snapshot.annualNetProfit,
        );

        if (!cancelled) {
          setTaxResult(result.result);
          setTaxMeta(result.meta);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (profile) run();

    return () => {
      cancelled = true;
    };
  }, [profile, snapshot.annualNetProfit, setTaxResult]);

  useEffect(() => {
    computeSafeToSpend({
      currentBalance,
      avgMonthlyExpenses: snapshot.avgMonthlyExpenses,
    });
  }, [
    currentBalance,
    snapshot.avgMonthlyExpenses,
    monthlyTaxReserve,
    computeSafeToSpend,
  ]);

  return (
    <div className="w-full min-h-screen background p-6 flex flex-col gap-6">
      <div className="w-full p-4 background-elevated border background-border flex items-center justify-center gap-4">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`border rounded-lg background-border background-elevated transition-all duration-300 cursor-pointer px-4 py-2 ${activeTab === tab.toLowerCase() ? "bg-(--accent-cyan)/20 border-(--accent-cyan)" : "hover:bg-(--accent-cyan)/20 hover:border-(--accent-cyan)"}`}
            onClick={() => router.push(`/finances?tab=${tab.toLowerCase()}`)}
          >
            <h1 className="text-primary">{tab}</h1>
          </div>
        ))}
      </div>

      {activeTab === "details" ? (
        <>
          <FinancesHero />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
            {/* Left column */}
            <div className="flex flex-col gap-6">
              {/* Cash Flow chart — primary visual */}
              <CashFlow />

              {/* Zone 3: Project profitability — detail on demand */}
              <ProjectProfitability />
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-6">
              {/* Recent transactions — live feed */}
              <RecentTransactions />

              {/* Savings goals */}
              <GoalsCardClient />

              {/* Cash flow simulator */}
              <TransactionSimulator />
            </div>
          </div>
        </>
      ) : activeTab === "taxes" ? (
        <TaxesTab
          isComputable={taxMeta.isComputable}
          pausalSource={taxMeta.pausalSource}
        />
      ) : activeTab === "transactions" ? (
        <>
          <h1>Transactions</h1>
        </>
      ) : (
        <>
          <FinancesHero />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
            {/* Left column */}
            <div className="flex flex-col gap-6">
              {/* Cash Flow chart — primary visual */}
              <CashFlow />

              {/* Zone 3: Project profitability — detail on demand */}
              <ProjectProfitability />
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-6">
              {/* Recent transactions — live feed */}
              <RecentTransactions />

              {/* Savings goals */}
              <GoalsCardClient />

              {/* Cash flow simulator */}
              <TransactionSimulator />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
