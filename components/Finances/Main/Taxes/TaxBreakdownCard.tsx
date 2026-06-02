"use client";

import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";

export default function TaxBreakdownCard() {
  const { taxResult } = useTaxProfileStore();

  const { incomeTax, pension, health } = taxResult.itemized;

  const total = incomeTax + pension + health;

  const incomePercent = total > 0 ? (incomeTax / total) * 100 : 0;
  const pensionPercent = total > 0 ? (pension / total) * 100 : 0;
  const healthPercent = total > 0 ? (health / total) * 100 : 0;

  return (
    <div
      className={`flex flex-col gap-4 border border-white/5 background-elevated rounded-2xl p-4 hover:border-(--accent-amber)/30 transition-all duration-300`}
    >
      <h1 className="text-sm uppercase tracking-wide primary-slate">
        Tax Breakdown
      </h1>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold uppercase primary-slate">
            Income Tax
          </h1>
          <p className="text-4xl font-bold font-mono text-primary">
            {incomeTax}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold uppercase primary-slate">
            Pension
          </h1>
          <p className="text-4xl font-bold font-mono text-primary">{pension}</p>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold uppercase primary-slate">Health</h1>
          <p className="text-4xl font-bold font-mono text-primary">{health}</p>
        </div>
      </div>
    </div>
  );
}
