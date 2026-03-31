import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function ScoreBadge({ score }: { score: number }) {
  const isRisk = score >= 5;
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider
      ${
        isRisk
          ? "bg-(--accent-red)/15 border-(--accent-red) text-(--accent-red)"
          : "bg-(--accent-cyan)/15 border-(--accent-cyan) text-(--accent-cyan)"
      }`}
    >
      {isRisk ? <AlertTriangle size={13} /> : <ShieldCheck size={13} />}
      {score}/9 — {isRisk ? "Rizik zavisnosti" : "Nezavisan odnos"}
    </div>
  );
}
