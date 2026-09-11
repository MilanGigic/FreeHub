"use client";

import { useEffect } from "react";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { calculateUserTax } from "@/actions/taxProfile/calculateUserTax";

export function useNetProfit(year = 2026) {
  const { setTaxResult, profile } = useTaxProfileStore();

  const userId = profile?.userId;

  useEffect(() => {
    const fetchNetProfit = async () => {
      if (!userId) return null;

      let period;
      if (profile.country === "Serbia") {
        if (profile.currentRegime === "freelancer") {
          period: "quarter";
        } else {
          period: "year";
        }
      }
      try {
        const taxResult = await calculateUserTax(userId, period);
        // const result = await computeTaxesAction(profile);
        setTaxResult(taxResult);
      } catch (error) {
        console.error("Error fetching net profit:", error);
      }
    };
    fetchNetProfit();
  }, [year, setTaxResult, profile, userId]);
}
