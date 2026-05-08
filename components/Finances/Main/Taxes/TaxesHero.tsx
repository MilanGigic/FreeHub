"use client";

import { PausalResolutionSource } from "@/lib/pausalResolver";
import { getStatus } from "./helpers/getStatus";
import { TaxResult } from "@/lib/store/useTaxProfileStore";
import MetricCard from "./helpers/MetricCard";
import { getNextQuarterlyPayment } from "@/lib/getNextQuarterlyPayment";
import {
  ShieldCheck,
  // ShieldAlert,
  // ShieldX,
  BadgeCheck,
  Wallet,
  CalendarClock,
  AlarmClock,
  Timer,
  CalendarCheck,
} from "lucide-react";

type Props = {
  isComputable: boolean;
  pausalSource?: PausalResolutionSource;
  taxResult: TaxResult;
};

export default function TaxesHero({
  isComputable,
  pausalSource,
  taxResult,
}: Props) {
  const status = getStatus(isComputable, pausalSource);

  const quarterlyPayment = getNextQuarterlyPayment();

  const deadlineIcon =
    quarterlyPayment.daysUntil < 8 ? (
      <AlarmClock className="primary-red" size={20} />
    ) : quarterlyPayment.daysUntil < 21 ? (
      <Timer className="primary-amber" size={20} />
    ) : quarterlyPayment.daysUntil < 31 ? (
      <CalendarClock className="primary-cyan" size={20} />
    ) : (
      <CalendarCheck className="primary-green" size={20} />
    );

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex gap-4 w-full h-full">
          <div
            className={`p-4 rounded-xl border flex w-[80%] items-center justify-center flex-col gap-4 ${status.container}`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="primary-green" size={32} />
              <span
                className={`text-3xl font-semibold uppercase ${status.text}`}
              >
                {status.label}
              </span>
            </div>

            {status.cta && (
              <button className="px-4 py-2 rounded-lg bg-(--accent-amber)/20 border border-(--accent-amber) text-primary hover:bg-(--accent-amber)/40 cursor-pointer transition-all duration-300">
                Dopuni profil
              </button>
            )}
          </div>

          <div className="w-[20%] flex flex-col items-center justify-center p-0.5 bg-linear-to-b from-(--accent-purple)/20 via-(--accent-green)/20 to-(--accent-cyan)/20 rounded-lg">
            <div className="text-primary bg-black/40 w-full h-full flex flex-col items-center justify-center rounded-lg">
              <h1 className="text-2xl flex items-center gap-2 font-semibold uppercase primary-cyan">
                <BadgeCheck />{" "}
                {status.label === "Verifikovan obračun" ? "Safe" : ""}
              </h1>
            </div>
          </div>
        </div>

        <div className="w-full border-b border-(--accent-slate) p-4">
          <h1 className="primary-slate">Bazirano na verifikovanim prijavama</h1>
        </div>

        <div className="background-elevated border background-border rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-zinc-600 transition-colors duration-200">
          <p className="primary-purple text-5xl font-bold tracking-tight flex items-center gap-2">
            <Wallet />
            {taxResult.monthlyTaxReserve.toLocaleString()} RSD
          </p>
          <h1 className="text-2xl text-primary">Mesečna rezerva</h1>
        </div>
      </div>

      <div className="flex justify-between w-full gap-4">
        <MetricCard
          label="Efektivna stopa"
          value={`${(taxResult.effectiveTaxRate * 100).toFixed(2)}%`}
        />
        <MetricCard
          label="Godišnji porez"
          value={`${taxResult.totalAnnualTax.toLocaleString()} RSD`}
        />
        <div className="background-elevated border background-border rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-zinc-600 transition-colors duration-200 w-full">
          <p
            className={`text-2xl font-bold flex items-center gap-2 tabular-nums ${quarterlyPayment.daysUntil < 8 ? "primary-red" : quarterlyPayment.daysUntil > 8 && quarterlyPayment.daysUntil < 21 ? "primary-amber" : quarterlyPayment.daysUntil > 21 && quarterlyPayment.daysUntil < 31 ? "primary-cyan" : "primary-green"}`}
          >
            {deadlineIcon} {quarterlyPayment.daysUntil} - dana do roka
          </p>
          <h1 className="text-xl text-primary">
            {quarterlyPayment.label} -{" "}
            <span>{quarterlyPayment.deadline.toLocaleDateString()}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
