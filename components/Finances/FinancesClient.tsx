"use client";

import { CountryTaxProfile } from "@/actions/taxProfile";
import FinancesHero from "@/components/Finances/FinancesHero";
import CashFlow from "@/components/Finances/Main/CashFlow";
import GoalsCardClient from "@/components/Finances/Main/GoalsCardClient";
import ProjectProfitability from "@/components/Finances/Main/ProjectProfitability";
import RecentTransactions from "@/components/Finances/Main/RecentTransactions";
import TransactionSimulator from "@/components/Finances/Main/TransactionSimulator";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { useEffect } from "react";

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
  const { update, computeTaxes, computeSafeToSpend, monthlyTaxReserve } =
    useTaxProfileStore();

  useEffect(() => {
    if (profile?.country === "United States") {
      update({
        entityType: profile.entityType,
        filingStatus: profile.filingStatus,
        stateResidence: profile.stateResidence ?? "",
        homeOfficeSqft: profile.homeOfficeSqft,
        homeOfficeSimplified: profile.homeOfficeSimplified ?? true,
        mileageTracking: profile.mileageTracking ?? false,
        healthInsuranceDeduction: profile.healthInsuranceDeduction ?? false,
      });
    }
    computeTaxes(snapshot.annualNetProfit);
  }, [profile, snapshot.annualNetProfit, update, computeTaxes]);

  useEffect(() => {
    // 3. Compute safe to spend — runs AFTER computeTaxes updates monthlyTaxReserve
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
    </div>
  );
}
