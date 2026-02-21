"use client";

import { useState, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  balance: number;
}

interface TooltipPayload {
  dataKey: string;
  value: number;
  payload: CashFlowData;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
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

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="background-elevated border background-border rounded-lg p-3 shadow-lg">
        <p className="text-secondary text-sm mb-2">
          {payload[0]?.payload?.date}
        </p>
        {payload.map((entry, index: number) => {
          if (entry.dataKey === "inflow" && entry.value > 0) {
            return (
              <p key={index} className="primary-green text-sm">
                Inflow: {formatCurrency(entry.value)}
              </p>
            );
          }
          if (entry.dataKey === "outflow" && entry.value > 0) {
            return (
              <p key={index} className="primary-red text-sm">
                Outflow: {formatCurrency(entry.value)}
              </p>
            );
          }
          if (entry.dataKey === "balance") {
            return (
              <p key={index} className="primary-cyan text-sm font-semibold">
                Balance: {formatCurrency(entry.value)}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  }
  return null;
};

// Helper function to generate sample data deterministically
function generateSampleData(days: number): CashFlowData[] {
  const data: CashFlowData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let runningBalance = 62000; // Starting balance

  // Predefined patterns for realistic cash flow
  const inflowPattern = [
    0, 0, 45000, 0, 0, 32000, 0, 0, 28000, 0, 0, 50000, 0, 0, 35000, 0, 0,
    40000, 0, 0, 38000, 0, 0, 42000, 0, 0, 30000, 0, 0, 48000,
  ];
  const outflowPattern = [
    12000, 0, 0, 15000, 0, 0, 18000, 0, 0, 14000, 0, 0, 16000, 0, 0, 13000, 0,
    0, 17000, 0, 0, 15000, 0, 0, 14000, 0, 0, 16000, 0, 0,
  ];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const inflow = inflowPattern[i % inflowPattern.length] || 0;
    const outflow = outflowPattern[i % outflowPattern.length] || 0;

    runningBalance = runningBalance + inflow - outflow;

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      inflow: Math.round(inflow),
      outflow: Math.round(outflow),
      balance: Math.round(runningBalance),
    });
  }

  return data;
}

export default function CashFlow() {
  const [timeRange, setTimeRange] = useState<"30" | "29">("29");

  // Sample data - replace with actual data from your backend
  const chartData = useMemo(() => {
    const days = timeRange === "30" ? 30 : 29;
    return generateSampleData(days);
  }, [timeRange]);

  return (
    <div className="col-span-2 w-full flex flex-col border background-border rounded-lg p-4 background-elevated gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-secondary uppercase">
          Cash Flow Forecast
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("30")}
            className={`px-3 py-1 text-sm rounded-lg transition-all ${
              timeRange === "30"
                ? "bg-[var(--border-default)] primary-cyan border border-[var(--accent-cyan)]"
                : "background-elevated text-secondary border background-border hover:border-[var(--border-interactive)]"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange("29")}
            className={`px-3 py-1 text-sm rounded-lg transition-all ${
              timeRange === "29"
                ? "bg-[var(--border-default)] primary-cyan border border-[var(--accent-cyan)]"
                : "background-elevated text-secondary border background-border hover:border-[var(--border-interactive)]"
            }`}
          >
            29 Days
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={150}>
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
            dataKey="inflow"
            fill="#2ea043"
            radius={[4, 4, 0, 0]}
            name="Inflow"
          />
          <Bar
            dataKey="outflow"
            fill="#f85149"
            radius={[4, 4, 0, 0]}
            name="Outflow"
          />
          <Line
            type="linear"
            dataKey="balance"
            stroke="#2dd4bf"
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={{ fill: "#2dd4bf", r: 2 }}
            activeDot={{ r: 4 }}
            name="Balance"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
