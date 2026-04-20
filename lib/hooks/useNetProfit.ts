"use client";

import { useEffect } from "react";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { computeTaxesAction } from "@/actions/computeTaxes";

export function useNetProfit(year = 2026) {
  const { setTaxResult, profile } = useTaxProfileStore();

  useEffect(() => {
    const fetchNetProfit = async () => {
      try {
        const res = await fetch(`/api/net-profit?year=${year}`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
        const { netProfit } = await res.json();

        const result = await computeTaxesAction(profile, netProfit);
        setTaxResult(result);
      } catch (error) {
        console.error("Error fetching net profit:", error);
      }
    };
    fetchNetProfit();
  }, [year, setTaxResult, profile]);
}
