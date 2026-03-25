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
import type { Invoice } from "@/types/types";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useTranslations } from "next-intl";

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
        <p className="text-primary text-sm mb-2">{payload[0]?.payload?.date}</p>
        {payload.map((entry, index: number) => {
          return (
            <p key={index} className="primary-slate text-sm">
              {entry.dataKey}:{" "}
              <span className="primary-green">
                {formatCurrency(entry.value)}
              </span>
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

function buildRevenueWindow(
  invoices: Invoice[],
  start: Date,
  end: Date,
): RevenueData[] {
  const data: RevenueData[] = [];
  const dayMs = 1000 * 60 * 60 * 24;
  const days =
    Math.floor((end.getTime() - start.getTime()) / dayMs) >= 0
      ? Math.floor((end.getTime() - start.getTime()) / dayMs) + 1
      : 0;

  const totalsByDay = new Map<string, number>();

  // Prepopulate all days in the window with 0 so the chart has a continuous x-axis
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = date.toISOString().slice(0, 10); // YYYY-MM-DD
    totalsByDay.set(key, 0);
  }

  if (invoices.length > 0) {
    invoices.forEach((invoice) => {
      if (invoice.status !== "paid") return;

      const rawDate = invoice.paymentDate || invoice.issueDate;
      const dateObj = new Date(rawDate);

      if (dateObj < start || dateObj > end) return;

      const key = dateObj.toISOString().slice(0, 10);
      const current = totalsByDay.get(key) ?? 0;
      totalsByDay.set(key, current + Number(invoice.totalAmount || 0));
    });
  } else {
    return [];
  }

  totalsByDay.forEach((value, key) => {
    const dateObj = new Date(key);
    data.push({
      date: dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value,
    });
  });

  // Ensure chronological order
  data.sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    return aDate.getTime() - bDate.getTime();
  });

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

export default function RevenueTrendGraph() {
  const { invoices } = useInvoiceStore();
  const t = useTranslations("clients");
  const [timeRange, setTimeRange] = useState<"30" | "365">("30");

  const { chartData, revenueTrendPercentage } = useMemo(() => {
    const now = new Date();
    const days = timeRange === "30" ? 30 : 365;

    const endCurrent = now;
    const startCurrent = new Date(endCurrent);
    startCurrent.setDate(endCurrent.getDate() - (days - 1));

    const endPrevious = new Date(startCurrent);
    endPrevious.setDate(startCurrent.getDate() - 1);
    const startPrevious = new Date(endPrevious);
    startPrevious.setDate(endPrevious.getDate() - (days - 1));

    const currentWindow = buildRevenueWindow(
      invoices,
      startCurrent,
      endCurrent,
    );
    const previousWindow = buildRevenueWindow(
      invoices,
      startPrevious,
      endPrevious,
    );

    const currentTotal = currentWindow.reduce(
      (sum, entry) => sum + entry.value,
      0,
    );
    const previousTotal = previousWindow.reduce(
      (sum, entry) => sum + entry.value,
      0,
    );

    let percentage = 0;
    if (previousTotal > 0) {
      percentage = ((currentTotal - previousTotal) / previousTotal) * 100;
    }

    return {
      chartData: currentWindow,
      revenueTrendPercentage: percentage,
    };
  }, [invoices, timeRange]);

  return (
    <div className="flex flex-col gap-2 md:gap-4 items-center justify-between p-4 background-elevated border background-border rounded-lg">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-semibold primary-slate uppercase">
          {t("revenueTrend")}
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
            {t("monthly")}
          </button>
          <button
            onClick={() => setTimeRange("365")}
            className={`px-3 py-1 text-sm rounded-lg transition-all ${
              timeRange === "365"
                ? "bg-(--border-default) primary-cyan border border-(--accent-cyan)"
                : "background-elevated primary-slate border background-border hover:border-(--border-interactive)"
            }`}
          >
            {t("yearly")}
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
            name={t("revenueChartName")}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p
        className={`text-sm font-semibold uppercase ${revenueTrendPercentage > 0 ? "primary-green" : revenueTrendPercentage < 0 ? "primary-red" : "primary-slate"}`}
      >
        {revenueTrendPercentage > 0 ? "+" : revenueTrendPercentage < 0 ? "-" : ""}
        {Math.abs(revenueTrendPercentage).toFixed(1)}% {t("vsLastPeriod")}
      </p>
    </div>
  );
}
