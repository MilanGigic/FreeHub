"use client";

import { useEffect } from "react";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { computeTaxesAction } from "@/actions/computeTaxes";

export function useNetProfit(year = 2026) {
  const { setTaxResult, profile } = useTaxProfileStore();

  useEffect(() => {
    const fetchNetProfit = async () => {
      try {
        const result = await computeTaxesAction(profile);
        setTaxResult(result.result);
      } catch (error) {
        console.error("Error fetching net profit:", error);
      }
    };
    fetchNetProfit();
  }, [year, setTaxResult, profile]);
}
