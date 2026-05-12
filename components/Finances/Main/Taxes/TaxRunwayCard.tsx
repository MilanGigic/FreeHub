"use client";

type TaxRunwayCardProps = {
  currentBalance: number;
  monthlyTaxReserve: number;
};

export default function TaxRunwayCard({
  currentBalance,
  monthlyTaxReserve,
}: TaxRunwayCardProps) {
  // ─── Core calculation ─────────────────────────────────────────────
  // How many months of taxes can user survive if income stops today

  const runwayMonths =
    monthlyTaxReserve > 0 ? currentBalance / monthlyTaxReserve : 0;

  // ─── UX states ────────────────────────────────────────────────────

  const status =
    runwayMonths >= 12
      ? {
          label: "Odlična sigurnost",
          color: "primary-green",
          border: "border-(--accent-green)/30",
          bg: "bg-(--accent-green)/10",
        }
      : runwayMonths >= 6
        ? {
            label: "Stabilna rezerva",
            color: "primary-cyan",
            border: "border-(--accent-cyan)/30",
            bg: "bg-(--accent-cyan)/10",
          }
        : runwayMonths >= 3
          ? {
              label: "Srednji rizik",
              color: "primary-amber",
              border: "border-(--accent-amber)/30",
              bg: "bg-(--accent-amber)/10",
            }
          : {
              label: "Niska rezerva",
              color: "primary-red",
              border: "border-(--accent-red)/30",
              bg: "bg-(--accent-red)/10",
            };

  // ─── Progress bar ─────────────────────────────────────────────────
  // 12 months = full bar

  const progress = Math.min((runwayMonths / 12) * 100, 100);

  return (
    <div
      className={`w-full rounded-2xl border background-elevated p-4 flex flex-col gap-4 transition-all duration-300 hover:border-zinc-600 ${status.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-sm uppercase tracking-wide primary-slate">
            Tax Runway
          </span>

          <h2 className="text-3xl font-bold text-primary tabular-nums">
            {runwayMonths.toFixed(1)}{" "}
            <span className="text-xl font-medium primary-slate">meseci</span>
          </h2>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-sm border ${status.border} ${status.bg} ${status.color}`}
        >
          {status.label}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full flex flex-col gap-2">
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${status.bg}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-xs primary-slate">
          <span>0m</span>
          <span>6m</span>
          <span>12m+</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-primary">
          Ako prihod stane danas, trenutni balans pokriva približno{" "}
          <span className={`font-semibold ${status.color}`}>
            {runwayMonths.toFixed(1)} meseci
          </span>{" "}
          poreskih obaveza.
        </p>

        <p className="text-xs primary-slate">
          Bazirano na mesečnoj rezervi od {monthlyTaxReserve.toLocaleString()}{" "}
          RSD.
        </p>
      </div>
    </div>
  );
}
