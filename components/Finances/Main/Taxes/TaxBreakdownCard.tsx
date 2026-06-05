"use client";

import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";

function fmt(value: number) {
  return value.toLocaleString("sr-RS", {
    style: "currency",
    currency: "RSD",
    maximumFractionDigits: 0,
  });
}

export default function TaxBreakdownCard() {
  const { taxResult } = useTaxProfileStore();
  const { incomeTax, pension, health, nezaposlenost } = taxResult.itemized;

  const total = incomeTax + pension + health;

  // Paušal: we know the total but cannot split it into components because
  // the PIO/health/tax allocation varies per municipality and activity code.
  const isPausal =
    taxResult.model === "PAUSAL" && total === 0 && taxResult.totalAnnualTax > 0;

  const incomePercent = total > 0 ? (incomeTax / total) * 100 : 0;
  const pensionPercent = total > 0 ? (pension / total) * 100 : 0;
  const healthPercent = total > 0 ? (health / total) * 100 : 0;

  return (
    <div className="flex flex-col gap-4 border border-white/5 background-elevated rounded-2xl p-4 hover:border-(--accent-amber)/30 transition-all duration-300">
      <h1 className="text-sm uppercase tracking-wide primary-slate">
        Tax Breakdown
      </h1>

      {isPausal ? (
        // ── Paušal: fixed monthly obligation, breakdown unavailable ──────────
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm uppercase tracking-wide primary-slate">
              Monthly Obligation
            </span>
            <p className="text-4xl font-bold font-mono text-primary">
              {fmt(taxResult.monthlyTaxReserve)}
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/3 px-4 py-3">
            <p className="text-xs primary-slate leading-relaxed">
              Paušalni porez je fiksna mesečna obaveza.
              <br />
              Raspodela na porez na dohodak, PIO i zdravstveno osiguranje zavisi
              od vaše opštine i šifre delatnosti i nije prikazana ovde.
            </p>
          </div>
        </div>
      ) : (
        // ── All other models: itemized breakdown ─────────────────────────────
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold uppercase primary-slate">
              Income Tax
            </h2>
            <p className="text-4xl font-bold font-mono text-primary">
              {fmt(incomeTax)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold uppercase primary-slate">
              Pension
            </h2>
            <p className="text-4xl font-bold font-mono text-primary">
              {fmt(pension)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold uppercase primary-slate">
              Nezaposlenost
            </h2>
            <p className="text-4xl font-bold font-mono text-primary">
              {fmt(nezaposlenost)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold uppercase primary-slate">
              Health
            </h2>
            <p className="text-4xl font-bold font-mono text-primary">
              {fmt(health)}
            </p>
          </div>

          {/* Visual proportion bar */}
          {total > 0 && (
            <div className="mt-1 flex h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-amber-400"
                style={{ width: `${incomePercent}%` }}
              />
              <div
                className="bg-blue-400"
                style={{ width: `${pensionPercent}%` }}
              />
              <div
                className="bg-emerald-400"
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
