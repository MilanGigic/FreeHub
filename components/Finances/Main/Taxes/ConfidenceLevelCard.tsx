"use client";

import { TaxResult } from "@/lib/store/useTaxProfileStore";
import { useEffect, useState } from "react";
import { getObservationsCount } from "./helpers/getObservationsCount";

type ConfidenceLevelCardProps = {
  taxResult: TaxResult;
};

export default function ConfidenceLevelCard({
  taxResult,
}: ConfidenceLevelCardProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getObservationsCount();

      setCount(res.length);
    })();
  }, []);

  const status = count
    ? count >= 12
      ? {
          label: "Visoka",
          description: "Pouzdanost računice visoke vrednosti",
          color: "primary-green",
          border: "border-(--accent-green)/30",
          bg: "bg-(--accent-green)/10",
        }
      : count >= 6
        ? {
            label: "Srednja",
            description: `Pouzdanost računice srednje vrednosti`,
            color: "primary-cyan",
            border: "border-(--accent-cyan)/30",
            bg: "bg-(--accent-cyan)/10",
          }
        : count >= 3
          ? {
              label: "Prihvatljiva",
              description: "Pouzdanost računice prihvatljive vrednosti",
              color: "primary-amber",
              border: "border-(--accent-amber)/30",
              bg: "bg-(--accent-amber)/10",
            }
          : {
              label: "Niska",
              description: "Pouzdanost računice niske vrednosti",
              color: "primary-red",
              border: "border-(--accent-red)/30",
              bg: "bg-(--accent-red)/10",
            }
    : {
        label: "Veoma Niska",
        description: "Pouzdanost računice veoma niske vrednosti",
        color: "primary-red",
        border: "border-(--accent-red)/80",
        bg: "bg-(--accent-red)/60",
      };

  return (
    <div className="flex flex-col gap-4 border border-(--accent-amber)/30 background-elevated rounded-2xl p-4 hover:border-zinc-600 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm uppercase tracking-wide primary-slate">
            Pouzdanost
          </span>
          <h1 className="text-xl font-bold uppercase text-primary">
            {status.description}
          </h1>
        </div>

        <div
          className={`px-3 py-1 flex items-center justify-center rounded-full text-sm border ${status.border} ${status.bg} ${status.color}`}
        >
          {status.label}
        </div>
      </div>

      <div className="w-full border-b border-(--accent-slate) pb-2">
        <h1 className="primary-slate">
          Bazirano na {count} verifikovanih prijava
          {/* ADD THE COUNT OF SUBMITS USED */}
        </h1>
      </div>
    </div>
  );
}
