"use client";

import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { Clock, Shield, TrendingDown, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FinancesHero() {
  const t = useTranslations("finances");
  const { safeToSpend, taxResult } = useTaxProfileStore();

  const stats = [
    {
      label: t("taxReserved"),
      value: `$${Number(taxResult.monthlyTaxReserve).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      icon: Shield,
      color: "text-(--accent-amber)",
      bg: "bg-(--accent-amber)/10",
      tooltip: t("taxReservedTooltip"),
    },
    {
      label: t("safetyBuffer"),
      value: `$${Number(safeToSpend.safetyBuffer).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      icon: Wallet,
      color: "text-(--accent-purple)",
      bg: "bg-(--accent-purple)/10",
      tooltip: t("safetyBufferTooltip"),
    },
    {
      label: t("cashRunwayDays"),
      value: safeToSpend.cashRunwayDays,
      icon: Clock,
      color: "text-(--accent-cyan)",
      bg: "bg-(--accent-cyan)/10",
      tooltip: t("cashRunwayTooltip"),
    },
    {
      label: t("effectiveTaxRate"),
      value: `${(Number(taxResult.effectiveTaxRate) * 100).toFixed(2)}%`,
      icon: TrendingDown,
      color: "text-(--accent-red)",
      bg: "bg-(--accent-red)/10",
      tooltip: t("effectiveTaxRateTooltip"),
    },
  ];

  return (
    <div className="w-full flex flex-col xl:flex-row gap-4 items-stretch">
      {/* Safe to Spend - dominant hero number */}
      <div className="relative overflow-hidden shrink-0 xl:w-72 p-px bg-linear-to-b from-(--accent-cyan) via-zinc-800 to-zinc-900 rounded-2xl">
        <div className="relative h-full background-elevated rounded-2xl p-6 flex flex-col justify-between gap-4">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent rounded-2xl pointer-events-none" />
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <p className="text-lg font-semibold tracking-widest text-primary uppercase">
            {t("safeToSpend")}
          </p>
          <div>
            <p className="text-5xl font-bold text-(--accent-cyan) leading-none tabular-nums">
              $
              {safeToSpend.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-primary mt-2">
              {t("afterTaxesAndExpenses")}
            </p>
          </div>

          {/* Mini burn rate indicator */}
          <div className="flex items-center gap-2 pt-2 border-t background-border">
            <div className="w-1.5 h-1.5 rounded-full bg-(--accent-cyan) animate-pulse" />
            <p className="text-xs text-primary">{t("liveBalance")}</p>
          </div>
          <p className="text-primary text-xs">{t("safeToSpendDescription")}</p>
        </div>
      </div>
      {/* Supporting stats — 2x2 grid */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="background-elevated border background-border rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-zinc-600 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-primary uppercase tracking-wide">
                  {stat.label}
                </p>
                <div
                  className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}
                >
                  <Icon size={13} className={stat.color} />
                </div>
              </div>
              <p className={`text-2xl font-bold tabular-nums ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-primary text-xs">{stat.tooltip}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
