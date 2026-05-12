"use client";

import { TaxResult } from "@/lib/store/useTaxProfileStore";

type VatStatusCardProps = {
  taxResult: TaxResult;
};
const VAT_LIMIT = 8000000;

export default function VatStatusCard({ taxResult }: VatStatusCardProps) {
  const vatStatus = (taxResult.netProfit / VAT_LIMIT) * 100;
  return (
    <div className="border background-border rounded-2xl p-6 background-elevated flex flex-col gap-4">
      <p className="text-lg font-semibold tracking-widest text-primary uppercase">
        VAT status
      </p>
      <div className="relative">
        <div
          className={`w-full p-6 border relative ${
            vatStatus < 50
              ? "border-(--accent-green)"
              : vatStatus > 50 && vatStatus < 85
                ? "border-(--accent-amber)"
                : vatStatus > 85 && "border-(--accent-red)"
          } rounded-2xl`}
        >
          <div
            style={{ width: `${vatStatus}%` }}
            className={`absolute h-full top-1/2 -translate-y-1/2 left-0 rounded-2xl
                      ${
                        vatStatus < 50
                          ? "bg-(--accent-green)"
                          : vatStatus > 50 && vatStatus < 85
                            ? "bg-(--accent-amber)"
                            : vatStatus > 85 && "bg-(--accent-red)"
                      }
                      `}
          />
          <h1 className="absolute text-primary top-1/2 left-4 -translate-y-1/2 font-bold text-2xl flex items-center gap-1">
            {taxResult.netProfit.toLocaleString()}{" "}
            <span className="text-lg text-primary font-semibold">RSD</span>
          </h1>
          <p className="absolute text-primary top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 font-semibold text-3xl">
            {vatStatus} %
          </p>
          <h1 className="absolute text-primary top-1/2 right-4 -translate-y-1/2 font-bold text-2xl flex items-center gap-1">
            {VAT_LIMIT.toLocaleString()}
            <span className="text-lg text-primary font-semibold">RSD</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
