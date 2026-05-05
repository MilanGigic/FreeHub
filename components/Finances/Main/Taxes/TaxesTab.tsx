"use client";

import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import MetricCard from "./helpers/MetricCard";
import { getStatus } from "./helpers/getStatus";
import ActionItem from "./helpers/ActionItem";

type Props = {
  isComputable: boolean;
  pausalSource?: "official" | "user" | "unknown";
};

export default function TaxesTab({ isComputable, pausalSource }: Props) {
  const {
    totalAnnualTax,
    monthlyTaxReserve,
    quarterlyEstimate,
    effectiveTaxRate,
    warnings,
  } = useTaxProfileStore();

  const status = getStatus(isComputable, pausalSource);

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Status Bar ───────────────────────────────────────────── */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between flex-col gap-4 ${status.container}`}
      >
        <div className="flex flex-col items-center w-full">
          <span className={`text-2xl font-medium ${status.text}`}>
            {status.label}
          </span>
          <span className="text-lg primary-slate">{status.description}</span>
        </div>

        {status.cta && (
          <button className="px-4 py-2 rounded-lg bg-(--accent-amber)/20 border border-(--accent-amber) text-primary hover:bg-(--accent-amber)/40 cursor-pointer transition-all duration-300">
            Dopuni profil
          </button>
        )}
      </div>

      {/* ─── Blocking State ───────────────────────────────────────── */}
      {!isComputable && (
        <div className="p-6 rounded-xl border background-elevated flex flex-col gap-4 items-center">
          <h2 className="text-lg font-semibold text-primary">
            Ne možemo izračunati porez
          </h2>

          <p className="text-sm primary-slate">
            Nedostaju podaci o opštini ili šifri delatnosti.
          </p>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-(--accent-amber)/20 border border-(--accent-amber) text-primary hover:bg-(--accent-amber)/40 cursor-pointer transition-all duration-300">
              Dopuni profil
            </button>
            <button className="px-4 py-2 rounded-lg border background-elevated text-primary border-(--accent-purple) bg-(--accent-purple)/20 hover:bg-(--accent-purple)/40 cursor-pointer transition-all duration-300">
              Unesi ručno
            </button>
          </div>
        </div>
      )}

      {/* ─── Main Content ─────────────────────────────────────────── */}
      {isComputable && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard
              label="Mesečna rezerva"
              value={`$${monthlyTaxReserve.toLocaleString()}`}
            />
            <MetricCard
              label="Kvartalno plaćanje"
              value={`$${quarterlyEstimate.toLocaleString()}`}
            />
            <MetricCard
              label="Godišnji porez"
              value={`$${totalAnnualTax.toLocaleString()}`}
            />
            <MetricCard
              label="Efektivna stopa"
              value={`${(effectiveTaxRate * 100).toFixed(2)}%`}
            />
          </div>

          {/* Data Source */}
          <div className="p-4 rounded-xl border background-elevated flex flex-col gap-2">
            <span className="text-sm text-secondary">Izvor podataka</span>

            <div className="flex items-center gap-2 text-sm">
              {pausalSource === "official" && (
                <span className="text-green-400">● Zvanični podaci</span>
              )}
              {pausalSource === "user" && (
                <span className="text-yellow-400">● Ručno uneto</span>
              )}
              {pausalSource === "unknown" && (
                <span className="text-red-400">● Nepoznato</span>
              )}
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="flex flex-col gap-2">
              {warnings.map((w, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border text-sm text-yellow-300 bg-yellow-500/10 border-yellow-500/20"
                >
                  {w}
                </div>
              ))}
            </div>
          )}

          {/* Action Panel */}
          <div className="p-4 rounded-xl border background-elevated flex flex-col gap-3">
            <h3 className="text-sm font-medium text-primary">Preporuke</h3>

            {pausalSource === "user" && (
              <ActionItem text="Dodajte opštinu i šifru delatnosti za precizan obračun." />
            )}

            {pausalSource === "official" && (
              <ActionItem text="Podaci su validni — nema dodatnih akcija." />
            )}

            {pausalSource === "unknown" && (
              <ActionItem text="Unesite paušalni iznos ili ažurirajte profil." />
            )}
          </div>
        </>
      )}
    </div>
  );
}
