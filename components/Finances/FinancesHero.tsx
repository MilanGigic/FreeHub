"use client";

import { useDataStore } from "@/lib/store/useDataStore";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { FileText, Shield, TrendingDown, TrendingUp } from "lucide-react";

export default function FinancesHero() {
  const { safeToSpend, taxReserved, netProfit } = useTaxProfileStore();
  const { balance } = useDataStore();

  const stats = [
    {
      label: "Total Cash Balance",
      value: `$${Number(balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Tax Reserved",
      value: `$${Number(taxReserved).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
      icon: Shield,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      label: "Net Profit",
      value: `$${Number(netProfit).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: netProfit >= 0 ? TrendingUp : TrendingDown,
      color: netProfit >= 0 ? "text-green-400" : "text-red-400",
      bg: netProfit >= 0 ? "bg-green-400/10" : "bg-red-400/10",
    },
    {
      label: "Unpaid Invoices",
      value: "$0", // wire from your invoices store/action
      icon: FileText,
      color: "text-red-400",
      bg: "bg-red-400/10",
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
            Safe to Spend
          </p>
          <div>
            <p className="text-5xl font-bold text-(--accent-cyan) leading-none tabular-nums">
              $
              {safeToSpend.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-primary mt-2">
              After taxes &amp; expenses
            </p>
          </div>

          {/* Mini burn rate indicator */}
          <div className="flex items-center gap-2 pt-2 border-t background-border">
            <div className="w-1.5 h-1.5 rounded-full bg-(--accent-cyan) animate-pulse" />
            <p className="text-xs text-primary">Live balance</p>
          </div>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
