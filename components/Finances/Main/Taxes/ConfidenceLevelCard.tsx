"use client";

import { TaxResult } from "@/lib/store/useTaxProfileStore";
import { useEffect, useState } from "react";
import { getObservationsCount } from "./helpers/getObservationsCount";
import { useTranslations } from "next-intl";

type ConfidenceLevelCardProps = {
  taxResult: TaxResult;
};

export default function ConfidenceLevelCard({
  taxResult,
}: ConfidenceLevelCardProps) {
  const t = useTranslations("taxes");

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
          label: "highConfidence",
          description: "highConfidenceDesc",
          color: "primary-green",
          border: "border-(--accent-green)/30",
          bg: "bg-(--accent-green)/10",
        }
      : count >= 6
        ? {
            label: "midConfidence",
            description: `midConfidenceDesc`,
            color: "primary-cyan",
            border: "border-(--accent-cyan)/30",
            bg: "bg-(--accent-cyan)/10",
          }
        : count >= 3
          ? {
              label: "acceptableConfidence",
              description: "acceptableConfidenceDesc",
              color: "primary-amber",
              border: "border-(--accent-amber)/30",
              bg: "bg-(--accent-amber)/10",
            }
          : {
              label: "lowConfidence",
              description: "lowConfidenceDesc",
              color: "primary-red",
              border: "border-(--accent-red)/30",
              bg: "bg-(--accent-red)/10",
            }
    : {
        label: "veryLowConfidence",
        description: "veryLowConfidenceDesc",
        color: "primary-red",
        border: "border-(--accent-red)/80",
        bg: "bg-(--accent-red)/60",
      };

  return (
    <div
      className={`flex flex-col gap-4 border border-white/5 background-elevated rounded-2xl p-4 hover:border-(--accent-amber)/30 transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm uppercase tracking-wide primary-slate">
            {t("confidence")}
          </span>
          <h1 className="text-xl font-bold uppercase text-primary">
            {t(`${status.description}`)}
          </h1>
        </div>

        <div
          className={`px-3 py-1 flex items-center justify-center rounded-full text-sm border ${status.border} ${status.bg} ${status.color}`}
        >
          {t(`${status.label}`)}
        </div>
      </div>

      <div className="w-full border-b border-(--accent-slate) pb-2">
        <h1 className="primary-slate">
          {" "}
          {t("confidenceDescription1")} {count} {t("confidenceDescription2")}
        </h1>
      </div>
    </div>
  );
}
