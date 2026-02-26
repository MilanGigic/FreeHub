import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueData {
  date: string;
  value: number;
}

interface TooltipPayload {
  dataKey: string;
  value: number;
  payload: RevenueData;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="background-elevated border background-border rounded-lg p-3 shadow-lg">
        <p className="text-secondary text-sm mb-2">
          {payload[0]?.payload?.date}
        </p>
        {payload.map((entry, index: number) => {
          return (
            <p key={index} className="text-secondary text-sm">
              {entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

function generateSampleData(days: number): RevenueData[] {
  const data: RevenueData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Example pattern for pure revenue values over time (no inflow/outflow/balance concept)
  const revenuePattern = [
    2000, 2200, 2500, 1900, 2300, 2400, 2100, 2500, 2700, 2600, 3000, 3200,
    3100, 2900, 3300, 3500, 3400, 3700, 3900, 3800, 4000, 4200, 4100, 4300,
    4400, 4600, 4700, 4500, 4800, 5000,
  ];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: revenuePattern[i % revenuePattern.length],
    });
  }

  return data;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const revenueTrendPercentage = 12;

export default function RevenueTrendGraph() {
  const [timeRange, setTimeRange] = useState<"30" | "365">("30");

  const chartData = useMemo(() => {
    const days = timeRange === "30" ? 30 : 365;
    return generateSampleData(days);
  }, [timeRange]);

  return (
    <div className="flex flex-col gap-2 md:gap-4 items-center justify-between p-4 background-elevated border background-border rounded-lg">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-semibold primary-slate uppercase">
          Revenue Trend
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("30")}
            className={`px-3 py-1 text-sm rounded-lg transition-all ${
              timeRange === "30"
                ? "bg-(--border-default) primary-cyan border border-(--accent-cyan)"
                : "background-elevated primary-slate border background-border hover:border-(--border-interactive)"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeRange("365")}
            className={`px-3 py-1 text-sm rounded-lg transition-all ${
              timeRange === "365"
                ? "bg-(--border-default) primary-cyan border border-(--accent-cyan)"
                : "background-elevated primary-slate border background-border hover:border-(--border-interactive)"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={100}>
        <ComposedChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#21262d"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#8b949e", fontSize: 12 }}
            axisLine={{ stroke: "#21262d" }}
            tickLine={{ stroke: "#21262d" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "#8b949e", fontSize: 12 }}
            axisLine={{ stroke: "#21262d" }}
            tickLine={{ stroke: "#21262d" }}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="#2ea043"
            radius={[4, 4, 0, 0]}
            name="Revenue"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p
        className={`text-sm font-semibold uppercase ${revenueTrendPercentage > 0 ? "primary-green" : revenueTrendPercentage < 0 ? "primary-red" : "primary-slate"}`}
      >
        {revenueTrendPercentage > 0 ? "+" : "-"}
        {revenueTrendPercentage}% vs last period
      </p>
    </div>
  );
}
