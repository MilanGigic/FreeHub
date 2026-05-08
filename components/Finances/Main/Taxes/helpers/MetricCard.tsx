import { Percent, Receipt } from "lucide-react";

export default function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const metricIcon = label === "Efektivna stopa" ? <Percent /> : <Receipt />;

  return (
    <div className="background-elevated border background-border rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-zinc-600 transition-colors duration-200 w-full">
      <p
        className={`text-2xl flex items-center gap-2 font-bold tabular-nums ${
          label === "Efektivna stopa"
            ? "primary-amber"
            : label === "Godišnji porez"
              ? "primary-red"
              : label === "Kvartalno plaćanje"
                ? "primary-cyan"
                : "text-primary"
        }`}
      >
        {metricIcon}
        {value}
      </p>
      <h1 className="text-xl text-primary">{label}</h1>
    </div>
  );
}
