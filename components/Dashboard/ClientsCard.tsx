import { useClientStore } from "@/lib/store/useClientStore";
import { useDataStore } from "@/lib/store/useDataStore";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

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
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2 - 10;
  const rx = W * 0.38; // horizontal radius
  const ry = rx * 0.45; // vertical radius (flattened = 3D look)
  const depth = 28; // cylinder depth
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total <= 0) return;

  let startAngle = -Math.PI / 2;
  const slices: PieSlice[] = data.map((d, i) => {
    const sweep = (d.value / total) * Math.PI * 2;
    const slice = {
      startAngle,
      sweep,
      color: colors[i % colors.length],
      name: d.name,
      value: d.value,
      percent: d.value / total,
    };
    startAngle += sweep;
    return slice;
  });

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
  return `rgb(${Math.round(r * factor)},${Math.round(g * factor)},${Math.round(
    b * factor,
  )})`;
}

const COLORS = ["#4ade80", "#fb923c", "#38bdf8", "#a855f7", "#facc15"];

export default function ClientsCard() {
  const { user } = useAuth();
  const { clients } = useClientStore();
  const { projects } = useDataStore();
  const { allOutstandingInvoices, allOverdueInvoices } = useInvoiceStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const clientContributionData = useMemo(() => {
    if (!clients.length || !projects.length) return [];

    const contributionByClient = new Map<string, number>();

    projects.forEach((project) => {
      const profit = Number(project.totalProfit || 0);
      if (!profit) return;
      const current = contributionByClient.get(project.clientId) ?? 0;
      contributionByClient.set(project.clientId, current + profit);
    });

    return clients
      .map((client) => ({
        name: `${client.firstName} ${client.lastName}`,
        value: contributionByClient.get(client.id) ?? 0,
      }))
      .filter((entry) => entry.value > 0);
  }, [clients, projects]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!clientContributionData.length) return;

    draw3DPie(canvasRef.current, clientContributionData, COLORS);
  }, [clientContributionData]);

  if (!user)
    return (
      <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg h-full">
        <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full text-xl font-bold uppercase text-center">
          Register or login to view your clients.
        </div>
      </div>
    );

  return (
    <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg h-full">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full">
        <header className="w-full text-2xl font-bold text-primary text-center uppercase flex flex-col border-b-2 background-border pb-4">
          <h1>Clients Overview</h1>
        </header>
        <main className="flex flex-col gap-2 space-y-1.5 text-sm items-center">
          <p className="text-lg primary-slate font-semibold uppercase">
            Clients:{" "}
            <span className="font-bold primary-green">{clients.length}</span>
          </p>
          <p className="flex items-center gap-2 text-lg primary-slate font-semibold uppercase">
            Outstanding Invoices:{" "}
            <span className="font-bold primary-amber flex items-center gap-2">
              ${allOutstandingInvoices.data} -{" "}
              <span className="text-sm primary-slate">
                {allOutstandingInvoices.count} invoices
              </span>
            </span>
          </p>
          <p className="flex items-center gap-2 text-lg primary-slate font-semibold uppercase">
            Overdue Invoices:{" "}
            <span className="font-bold primary-red flex items-center gap-2">
              ${allOverdueInvoices.data} -{" "}
              <span className="text-sm primary-slate">
                {allOverdueInvoices.count} invoices
              </span>
            </span>
          </p>
          <p className="text-lg primary-slate font-semibold uppercase text-center w-full">
            Top Client Contributions
          </p>
          <div className="w-full flex flex-col items-center mt-2">
            {clientContributionData.length > 0 ? (
              <>
                <canvas
                  ref={canvasRef}
                  width={260}
                  height={160}
                  style={{
                    filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))",
                  }}
                />
                <div className="flex gap-4 mt-2 flex-wrap justify-center">
                  {clientContributionData.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-1.5 text-xs text-gray-400"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-sm inline-block"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      {item.name}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm primary-slate">
                No revenue data yet for your clients.
              </p>
            )}
          </div>
        </main>

        <Link
          href="/clients"
          className="text-primary underline w-full flex items-center justify-center gap-2 text-2xl font-bold uppercase hover:text-(--accent-cyan) transition-colors duration-300"
        >
          Go to Clients
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
