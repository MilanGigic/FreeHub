"use client";

import { fetchCashFlowData } from "@/actions/taxProfile/fetchCashFlowData";
import { useDataStore } from "@/lib/store/useDataStore";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useMemo, useState } from "react";
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
import { useTranslations } from "next-intl";

interface CashFlowData {
  date: string;
  dateLabel: string;
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
  labels?: { inflow: string; outflow: string; balance: string };
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

const CustomTooltip = ({ active, payload, labels }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="background-elevated border background-border rounded-lg p-3 shadow-lg">
        <p className="primary-slate text-sm mb-2">
          {payload[0]?.payload?.dateLabel}
        </p>
        {payload.map((entry, index: number) => {
          if (entry.dataKey === "inflow" && entry.value > 0) {
            return (
              <p key={index} className="primary-green text-sm">
                {labels?.inflow} {formatCurrency(entry.value)}
              </p>
            );
          }
          if (entry.dataKey === "outflow" && entry.value > 0) {
            return (
              <p key={index} className="primary-red text-sm">
                {labels?.outflow} {formatCurrency(entry.value)}
              </p>
            );
          }
          if (entry.dataKey === "balance") {
            return (
              <p key={index} className="primary-cyan text-sm font-semibold">
                {labels?.balance} {formatCurrency(entry.value)}
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

export default function CashFlow() {
  const { user } = useAuth();
  const { balance } = useDataStore();
  const t = useTranslations("finances");
  const tCommon = useTranslations("common");
  const [timeRange, setTimeRange] = useState<"30" | "365">("30");
  const [rawData, setRawData] = useState<
    Awaited<ReturnType<typeof fetchCashFlowData>>["data"]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => {
        setRawData([]);
        setLoading(false);
      });
      return;
    }
    let cancelled = false;
    queueMicrotask(() => setLoading(true));
    const days = timeRange === "30" ? 30 : 365;
    fetchCashFlowData(user.id, days).then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        setRawData(res.data);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user, timeRange]);

  const chartData = useMemo((): CashFlowData[] => {
    if (!rawData.length) return [];
    const currentBalance = Number(balance || 0);
    const netChange = rawData.reduce((sum, d) => sum + d.inflow - d.outflow, 0);
    let runningBalance = currentBalance - netChange;
    return rawData.map((d) => {
      runningBalance += d.inflow - d.outflow;
      return {
        ...d,
        balance: Math.round(runningBalance * 100) / 100,
      };
    });
  }, [rawData, balance]);

  const tooltipLabels = {
    inflow: t("inflowLabel"),
    outflow: t("outflowLabel"),
    balance: t("balanceLabel"),
  };

  return (
    <div className="col-span-2 w-full flex flex-col border background-border rounded-lg p-4 background-elevated gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-widest text-primary uppercase">
          {t("cashFlowForecast")}
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
            {t("thirtyDays")}
          </button>
          <button
            onClick={() => setTimeRange("365")}
            className={`px-3 py-1 text-sm rounded-lg transition-all ${
              timeRange === "365"
                ? "bg-(--border-default) primary-cyan border border-(--accent-cyan)"
                : "background-elevated primary-slate border background-border hover:border-(--border-interactive)"
            }`}
          >
            {t("threeSixtyFiveDays")}
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={150}>
        {loading ? (
          <div className="w-full h-full flex items-center justify-center primary-slate text-sm">
            {tCommon("loading")}
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center primary-slate text-sm">
            {t("noTransactionData")}
          </div>
        ) : (
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
              dataKey="dateLabel"
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
            <Tooltip content={<CustomTooltip labels={tooltipLabels} />} />
            <Bar
              dataKey="inflow"
              fill="#2ea043"
              radius={[4, 4, 0, 0]}
              name={t("inflow")}
            />
            <Bar
              dataKey="outflow"
              fill="#f85149"
              radius={[4, 4, 0, 0]}
              name={t("outflow")}
            />
            <Line
              type="linear"
              dataKey="balance"
              stroke="#2dd4bf"
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={{ fill: "#2dd4bf", r: 2 }}
              activeDot={{ r: 4 }}
              name={t("balance")}
            />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
