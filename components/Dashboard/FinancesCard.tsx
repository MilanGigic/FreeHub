"use client";

import { useDataStore } from "@/lib/store/useDataStore";

import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { useAuth } from "@/lib/useAuth";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

type PieSlice = {
  startAngle: number;
  sweep: number;
  color: string;
  name: string;
  value: number;
  percent: number;
};

function draw3DPie(
  canvas: HTMLCanvasElement,
  data: { name: string; value: number }[],
  colors: string[],
) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  ctx?.clearRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2 - 10;
  const rx = W * 0.38; // horizontal radius
  const ry = rx * 0.45; // vertical radius (flattened = 3D look)
  const depth = 28; // cylinder depth
  const total = data.reduce((s, d) => s + d.value, 0);

  let startAngle = -Math.PI / 2;
  const slices: PieSlice[] = data.map((d, i) => {
    const sweep = (d.value / total) * Math.PI * 2;
    const slice = {
      startAngle,
      sweep,
      color: colors[i],
      name: d.name,
      value: d.value,
      percent: d.value / total,
    };
    startAngle += sweep;
    return slice;
  });

  if (!ctx) return;

  // Draw side faces (back-to-front for correct layering)
  [...slices].reverse().forEach((slice) => {
    const midAngle = slice.startAngle + slice.sweep / 2;
    // Only draw sides facing "down" (bottom half of pie)
    if (Math.sin(midAngle) > -0.1) {
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy + depth,
        rx,
        ry,
        0,
        slice.startAngle,
        slice.startAngle + slice.sweep,
      );
      ctx.lineTo(
        cx + rx * Math.cos(slice.startAngle + slice.sweep),
        cy + ry * Math.sin(slice.startAngle + slice.sweep),
      );
      ctx.ellipse(
        cx,
        cy,
        rx,
        ry,
        0,
        slice.startAngle + slice.sweep,
        slice.startAngle,
        true,
      );
      ctx.closePath();
      // Darken the side face
      const base = slice.color;
      ctx.fillStyle = darken(base, 0.55);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });

  // Draw top faces
  slices.forEach((slice) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.ellipse(
      cx,
      cy,
      rx,
      ry,
      0,
      slice.startAngle,
      slice.startAngle + slice.sweep,
    );
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Percentage labels
    const labelAngle = slice.startAngle + slice.sweep / 2;
    const lx = cx + rx * 0.62 * Math.cos(labelAngle);
    const ly = cy + ry * 0.62 * Math.sin(labelAngle);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px 'DM Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 4;
    ctx.fillText(`${(slice.percent * 100).toFixed(0)}%`, lx, ly);
    ctx.shadowBlur = 0;
  });
}

function darken(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.round(r * factor)},${Math.round(g * factor)},${Math.round(b * factor)})`;
}

const COLORS = ["#4ade80", "#fb923c", "#38bdf8"];

export default function FinancesCard() {
  const { projects } = useDataStore();
  const { user } = useAuth();

  const { netProfit, monthlyTaxReserve, safeToSpend, computeSafeToSpend } =
    useTaxProfileStore(); // Extend store with income/expenses
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { avgMonthlyExpenses } = useDataStore();
  const t = useTranslations("dashboard");

  useEffect(() => {
    const currentBalance = projects.reduce(
      (acc, project) => acc + Number(project.totalProfit || 0),
      0,
    );

    computeSafeToSpend({
      currentBalance,
      avgMonthlyExpenses: Number(avgMonthlyExpenses),
    });
  }, [projects, computeSafeToSpend, avgMonthlyExpenses]);

  const numericTotalIncome = projects.reduce(
    (acc, p) => acc + Number(p.totalRevenue || 0),
    0,
  );
  const numericTotalExpenses = projects.reduce(
    (acc, p) => acc + Number(p.totalExpenses || 0),
    0,
  );
  const profitMargin =
    numericTotalIncome > 0
      ? ((netProfit / numericTotalIncome) * 100).toFixed(1)
      : 0;

  const chartData = useMemo(
    () => [
      { name: t("chartNetProfit"), value: Math.max(0, Number(netProfit)) },
      { name: t("chartExpenses"), value: Math.max(0, numericTotalExpenses) },
      { name: t("chartTaxReserved"), value: Math.max(0, Number(monthlyTaxReserve)) },
    ],
    [netProfit, numericTotalExpenses, monthlyTaxReserve, t],
  );

  useEffect(() => {
    if (canvasRef.current) {
      draw3DPie(canvasRef.current, chartData, COLORS);
    }
  }, [chartData]);

  const legendItems = chartData.map((d, i) => ({
    ...d,
    color: COLORS[i],
    total: chartData.reduce((s, x) => s + x.value, 0),
  }));

  if (!user)
    return (
      <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg h-full">
        <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full text-xl font-bold uppercase text-center">
          {t("loginToViewFinances")}
        </div>
      </div>
    );

  return (
    <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg primary-slate h-full">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full">
        <header className="w-full text-2xl font-bold text-primary text-center uppercase flex flex-col border-b-2 background-border pb-4">
          <h1>{t("financesOverview")}</h1>
        </header>

        <div className="flex flex-col  gap-4">
          <main className="space-y-1.5 text-sm flex flex-col items-center">
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("ytdIncome")}{" "}
              <span className="font-bold primary-green">
                ${numericTotalIncome.toLocaleString()}
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("expenses")}{" "}
              <span className="font-bold primary-red">
                ${numericTotalExpenses.toLocaleString()}
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("netProfit")}{" "}
              <span className="font-bold primary-green">
                ${Number(netProfit).toLocaleString()}
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("profitMargin")} <span className="font-bold">{profitMargin}%</span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("taxReserved")}{" "}
              <span className="font-bold primary-amber">
                ${Number(monthlyTaxReserve).toLocaleString()}
              </span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("safeToSpend")}{" "}
              <span className="font-bold primary-cyan">
                ${Number(safeToSpend).toLocaleString()}
              </span>
            </p>
          </main>
          <div className="mt-2 flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={260}
              height={160}
              style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}
            />
            {/* Legend */}
            <div className="flex gap-4 mt-2 flex-wrap justify-center">
              {legendItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1.5 text-xs text-gray-400"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-sm inline-block"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link
          href="/finances"
          className="text-primary underline w-full flex items-center justify-center gap-2 text-2xl font-bold uppercase hover:text-(--accent-cyan) transition-colors duration-300"
        >
          {t("goToFinances")}
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
