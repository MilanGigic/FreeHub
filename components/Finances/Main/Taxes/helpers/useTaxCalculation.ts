"use client";

import { computeTaxesAction } from "@/actions/computeTaxes";
import { FinancesProps } from "@/components/Finances/FinancesClient";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { useEffect } from "react";

export const useTaxCalculation = ({
  profile,
  snapshot,
  currentBalance,
}: FinancesProps) => {
  const { setTaxResult, setTaxMeta, computeSafeToSpend, taxResult } =
    useTaxProfileStore();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const result = await computeTaxesAction(profile);

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
  }, [profile, snapshot.annualNetProfit, setTaxResult, setTaxMeta]);

  useEffect(() => {
    computeSafeToSpend({
      currentBalance,
      avgMonthlyExpenses: snapshot.avgMonthlyExpenses,
    });
  }, [
    currentBalance,
    snapshot.avgMonthlyExpenses,
    taxResult.monthlyTaxReserve,
    computeSafeToSpend,
  ]);
};
