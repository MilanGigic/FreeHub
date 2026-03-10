"use client";

import { useEffect } from "react";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";

export function useNetProfit(year = 2026) {
  const { computeTaxes } = useTaxProfileStore();

  useEffect(() => {
    const fetchNetProfit = async () => {
      try {
        const res = await fetch(`/api/net-profit?year=${year}`);
        if (!res.ok) throw new Error("Fetch failed");
        const { netProfit } = await res.json();

        const profile = useTaxProfileStore.getState();
        computeTaxes(netProfit);
      } catch (error) {
        console.error("Error fetching net profit:", error);
      }
    };
    fetchNetProfit();
  }, [year, computeTaxes]);
}
