"use client";

import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";

export default function ProfitAfterTaxCard() {
  const { taxResult } = useTaxProfileStore();
  return (
    <div
      className={`flex flex-col gap-4 border border-white/5 background-elevated rounded-2xl p-4 hover:border-(--accent-amber)/30 transition-all duration-300`}
    >
      <h1 className="text-sm uppercase tracking-wide primary-slate">
        Profit After Taxes
      </h1>

      <p className="text-4xl font-bold text-(--accent-cyan) leading-none tabular-nums flex items-center gap-1">
        {taxResult.profitAfterTaxes.toLocaleString()} <span>RSD</span>
      </p>
    </div>
  );
}
