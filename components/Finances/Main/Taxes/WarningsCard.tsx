"use client";

import { TaxResult } from "@/lib/store/useTaxProfileStore";

type WarningsCardProps = {
  taxResult: TaxResult;
};

export default function WarningsCard({ taxResult }: WarningsCardProps) {
  return (
    <div className="flex flex-col gap-2">
      {taxResult.warnings.map((w, i) => (
        <div
          key={i}
          className="p-3 rounded-lg border text-sm text-yellow-300 bg-yellow-500/10 border-yellow-500/20"
        >
          {w}
        </div>
      ))}
    </div>
  );
}
