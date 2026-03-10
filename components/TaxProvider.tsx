"use client";

import { useNetProfit } from "@/lib/hooks/useNetProfit";

export function TaxProvider({ children }: { children: React.ReactNode }) {
  useNetProfit(2026);
  return <>{children}</>;
}
