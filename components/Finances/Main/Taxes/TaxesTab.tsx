"use client";

import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { PausalResolutionSource } from "@/lib/pausalResolver";
import TaxesHero from "./TaxesHero";
import { useTranslations } from "next-intl";
import TaxRunwayCard from "./TaxRunwayCard";

type Props = {
  isComputable: boolean;
  pausalSource?: PausalResolutionSource;
};

const VAT_LIMIT = 8000000;

export default function TaxesTab({ isComputable, pausalSource }: Props) {
  const { taxResult } = useTaxProfileStore();
  const f = useTranslations("finances");

  const vatStatus = (taxResult.netProfit / VAT_LIMIT) * 100;

  const PAUSAL_TO_KNJIGAS_LIMIT = 6000000;

  const status =
    taxResult.warnings.length >= 12
      ? {
          label: "Niska",
          color: "primary-red",
          border: "border-(--accent-red)/30",
          bg: "bg-(--accent-red)/10",
        }
      : taxResult.warnings.length >= 6
        ? {
            label: "Prihvatljiva",
            color: "primary-amber",
            border: "border-(--accent-amber)/30",
            bg: "bg-(--accent-amber)/10",
          }
        : taxResult.warnings.length >= 3
          ? {
              label: "Srednja",
              color: "primary-cyan",
              border: "border-(--accent-cyan)/30",
              bg: "bg-(--accent-cyan)/10",
            }
          : {
              label: "Visoka",
              color: "primary-green",
              border: "border-(--accent-green)/30",
              bg: "bg-(--accent-green)/10",
            };

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
            </div>
            <div className="w-full h-full border background-border rounded-2xl p-6 background-elevated flex flex-col gap-4">
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
                    <span className="text-lg text-primary font-semibold">
                      RSD
                    </span>
                  </h1>
                  <p className="absolute text-primary top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 font-semibold text-3xl">
                    {vatStatus} %
                  </p>
                  <h1 className="absolute text-primary top-1/2 right-4 -translate-y-1/2 font-bold text-2xl flex items-center gap-1">
                    {VAT_LIMIT.toLocaleString()}
                    <span className="text-lg text-primary font-semibold">
                      RSD
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:grid xl:grid-cols-12 flex flex-col w-full h-full gap-4">
            <div className="xl:col-span-4 w-full h-full">
              <TaxRunwayCard
                currentBalance={taxResult.netProfit}
                monthlyTaxReserve={taxResult.monthlyTaxReserve}
              />
            </div>
            <div className="xl:col-span-4 flex flex-col gap-4 w-full h-full border background-border background-elevated rounded-2xl p-4 hover:border-zinc-600 transition-all duration-300">
              <div className="flex flex-col">
                <span className="text-sm uppercase tracking-wide primary-slate">
                  Optimalnost režima
                </span>
                <h1 className="text-xl font-bold uppercase text-primary">
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
                  {/* ADD PROGRESS BAR */}
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 bg-(--accent-cyan)`}
                      // Add different colors for different numbers
                      style={{
                        width: `${(taxResult.netProfit / 5900000) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <h1 className="text-primary">
                      Optimalna tranzicija ~5,900,000 RSD
                    </h1>
                    <span className="primary-slate uppercase text-sm">
                      - Trenutni prihod:
                    </span>
                    <h1 className="text-primary">
                      {taxResult.netProfit.toLocaleString()} RSD
                    </h1>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="xl:col-span-4 flex flex-col gap-4 w-full h-full border background-border background-elevated rounded-2xl p-4 hover:border-zinc-600 transition-all duration-300">
              <div className="w-full flex justify-between">
                <span className="text-sm uppercase tracking-wide primary-slate">
                  Pouzdanost
                </span>

                <div
                  className={`px-3 py-1 rounded-full text-sm border ${status.border} ${status.bg} ${status.color}`}
                >
                  {status.label}
                </div>
              </div>

              <div className="w-full border-b border-(--accent-slate) pb-2">
                <h1 className="primary-slate">
                  Bazirano na verifikovanim prijavama
                  {/* ADD THE COUNT OF SUBMITS USED */}
                </h1>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {taxResult.warnings.length > 0 && (
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
          )}
        </div>
      )}
    </div>
  );
}
