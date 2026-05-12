"use client";

import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { PausalResolutionSource } from "@/lib/pausalResolver";
import TaxesHero from "./TaxesHero";
import TaxRunwayCard from "./TaxRunwayCard";
import RegimeOptimizationCard from "./RegimeOptimizationCard";
import VatStatusCard from "./VatStatusCard";
import NetProfitCard from "./NetProfitCard";
import ConfidenceLevelCard from "./ConfidenceLevelCard";
import WarningsCard from "./WarningsCard";

type TaxesTabProps = {
  isComputable: boolean;
  pausalSource?: PausalResolutionSource;
};

export default function TaxesTab({
  isComputable,
  pausalSource,
}: TaxesTabProps) {
  const { taxResult } = useTaxProfileStore();

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Status Bar ───────────────────────────────────────────── */}
      <TaxesHero
        isComputable={isComputable}
        pausalSource={pausalSource}
        taxResult={taxResult}
      />

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
        <div className="flex flex-col w-full h-full gap-4">
          {/* Metrics */}
          <div className="flex xl:flex-row flex-col gap-4 w-full justify-between xl:h-[140px]">
            <div className="w-full h-full">
              <NetProfitCard taxResult={taxResult} />
            </div>
            <div className="w-full h-full">
              <VatStatusCard taxResult={taxResult} />
            </div>
          </div>

          <div className="xl:grid xl:grid-cols-12 flex flex-col w-full h-full gap-4">
            <div className="xl:col-span-4 w-full h-full">
              <TaxRunwayCard
                currentBalance={taxResult.netProfit}
                monthlyTaxReserve={taxResult.monthlyTaxReserve}
              />
            </div>
            <div className="xl:col-span-4 w-full h-full">
              <RegimeOptimizationCard taxResult={taxResult} />
            </div>
            <div className="xl:col-span-4 w-full h-full">
              <ConfidenceLevelCard taxResult={taxResult} />
            </div>
          </div>

          {/* Warnings */}
          {taxResult.warnings.length > 0 && (
            <WarningsCard taxResult={taxResult} />
          )}
        </div>
      )}
    </div>
  );
}
