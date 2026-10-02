"use client";

import { TaxResult } from "@/lib/store/useTaxProfileStore";
import { useTranslations } from "next-intl";

type RegimeOptimizationCardProps = {
  taxResult: TaxResult;
};

export default function RegimeOptimizationCard({
  taxResult,
}: RegimeOptimizationCardProps) {
  const t = useTranslations("taxes");

  const PAUSAL_TO_KNJIGAS_LIMIT = 6000000;

  return (
    <div className="flex flex-col gap-4 border border-white/5 hover:border-(--accent-cyan)/30 background-elevated rounded-2xl p-4  transition-all duration-300">
      <div className="flex flex-col">
        <span className="text-sm uppercase tracking-wide primary-slate">
          {t("regimeEfficiency")}
        </span>
        <h1 className="text-2xl font-bold uppercase text-primary">
          {taxResult.netProfit >
            PAUSAL_TO_KNJIGAS_LIMIT - PAUSAL_TO_KNJIGAS_LIMIT * 0.1 &&
          taxResult.netProfit < PAUSAL_TO_KNJIGAS_LIMIT
            ? "Blizu ste dozvoljene granice"
            : taxResult.netProfit < PAUSAL_TO_KNJIGAS_LIMIT
              ? "Trenutni režim još uvek optimalan"
              : "Morate da pređete na Knjigaša"}
        </h1>
      </div>
      {taxResult.netProfit >
        PAUSAL_TO_KNJIGAS_LIMIT - PAUSAL_TO_KNJIGAS_LIMIT * 0.1 &&
      taxResult.netProfit < PAUSAL_TO_KNJIGAS_LIMIT ? (
        <div></div>
      ) : taxResult.netProfit < PAUSAL_TO_KNJIGAS_LIMIT ? (
        <div className="flex flex-col h-full gap-4">
          <div className="w-full flex flex-col gap-2">
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 bg-(--accent-cyan)`}
                // Add different colors for different numbers
                style={{
                  width: `${(taxResult.annualRevenue / 5900000) * 100}%`,
                }}
              />
            </div>
            <div className="flex w-full justify-between">
              <span className="primary-slate tracking-wide text-xs">
                {taxResult.annualRevenue.toLocaleString()} RSD
              </span>
              <span className="primary-slate tracking-wide text-xs">
                {PAUSAL_TO_KNJIGAS_LIMIT.toLocaleString()} RSD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-primary">
              {t("optimalTransition")} ~5,900,000 RSD
            </h1>
            <span className="primary-slate uppercase text-sm">
              - {t("currentIncome")}:
            </span>
            <h1 className="text-primary">
              {taxResult.annualRevenue.toLocaleString()} RSD
            </h1>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
