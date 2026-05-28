"use client";
import FinancesHero from "@/components/Finances/FinancesHero";
import CashFlow from "@/components/Finances/Main/Overview/CashFlow";
import GoalsCardClient from "@/components/Finances/Main/Overview/GoalsCardClient";
import ProjectProfitability from "@/components/Finances/Main/Overview/ProjectProfitability";
import RecentTransactions from "@/components/Finances/Main/Overview/RecentTransactions";
import TransactionSimulator from "@/components/Finances/Main/Overview/TransactionSimulator";
import { TaxResult } from "@/lib/store/useTaxProfileStore";
import { useRouter, useSearchParams } from "next/navigation";
import TaxesTab from "./Main/Taxes/TaxesTab";
import { useTranslations } from "next-intl";
import TransactionsTab from "./Main/Transactions/TransactionsTab";
import { PausalResolutionSource } from "@/lib/pausalResolver";
import { TaxStoreHydrator } from "./TaxStoreHydrator";
const tabs = [
  { key: "details", label: "Details" },
  { key: "taxes", label: "Taxes" },
  { key: "transactions", label: "Transactions" },
];
export type FinancesProps = {
  initialTaxResult: TaxResult;
  initialTaxMeta: {
    isComputable: boolean;
    pausalSource?: PausalResolutionSource;
  };
};
export default function FinancesClient({
  initialTaxResult,
  initialTaxMeta,
}: FinancesProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");
  const f = useTranslations("finances");
  const router = useRouter();
  return (
    <div className="w-full min-h-screen background p-6 flex flex-col gap-6">
      <TaxStoreHydrator taxResult={initialTaxResult} taxMeta={initialTaxMeta} />
      <div className="w-full p-4 background-elevated border background-border flex items-center justify-center gap-2 lg:gap-4">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`border rounded-lg background-border background-elevated transition-all duration-300 cursor-pointer px-4 py-2 ${activeTab === tab.key ? "bg-(--accent-cyan)/20 border-(--accent-cyan)" : "hover:bg-(--accent-cyan)/20 hover:border-(--accent-cyan)"}`}
            onClick={() => router.replace(`/finances?tab=${tab.key}`)}
          >
            <h1 className="text-primary">{f(tab.key)}</h1>
          </div>
        ))}
      </div>
      {activeTab === "details" || !activeTab ? (
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
          isComputable={initialTaxMeta.isComputable}
          pausalSource={initialTaxMeta.pausalSource}
        />
      ) : (
        activeTab === "transactions" && <TransactionsTab />
      )}
    </div>
  );
}
