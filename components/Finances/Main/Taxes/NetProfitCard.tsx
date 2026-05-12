"use client";

import { TaxResult } from "@/lib/store/useTaxProfileStore";
import { useTranslations } from "next-intl";

type NetProfitCardProps = {
  taxResult: TaxResult;
};

export default function NetProfitCard({ taxResult }: NetProfitCardProps) {
  const f = useTranslations("finances");

  return (
    <div className="relative overflow-hidden shrink-0 w-full p-px bg-linear-to-b from-(--accent-green) via-zinc-800 to-zinc-900 rounded-2xl">
      <div className="relative h-full background-elevated rounded-2xl p-6 flex flex-col justify-between gap-4">
        <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent rounded-2xl pointer-events-none" />
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />

        <p className="text-lg font-semibold tracking-widest text-primary uppercase">
          {f("netProfitDelta")}
        </p>
        <div>
          <p className="text-5xl font-bold text-(--accent-green) leading-none tabular-nums flex items-center gap-1">
            {taxResult.netProfit.toLocaleString()}{" "}
            <span className="primary-slate text-4xl">RSD</span>
          </p>
        </div>
      </div>
    </div>
  );
}
