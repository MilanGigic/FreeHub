// components/finances/CashFlowSimulator.tsx
"use client";
import { useState, useTransition, useMemo, useEffect } from "react";
import { commitTransaction } from "@/actions/finances/commitTransaction";
import {
  simulate,
  type SimulationInput,
  type SimulationResult,
} from "@/utils/simulateCashFlow";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import type { Transaction } from "@/types/types";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/useAuth";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { fetchRecentTransactions } from "@/actions/finances/fetchRecentTransactions";

const EMPTY_FORM: SimulationInput = {
  type: "expense",
  amount: 0,
  isRecurring: false,
  note: "",
  deductible: false,
};

function deltaColor(val: number) {
  return val >= 0 ? "text-green-400" : "text-red-400";
}

function DeltaBadge({
  value,
  prefix = "$",
}: {
  value: number;
  prefix?: string;
}) {
  return (
    <span className={`font-bold ${deltaColor(value)}`}>
      {value >= 0 ? "+" : ""}
      {prefix}
      {Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}
    </span>
  );
}

function deriveTaxRate(entityType: string | null): number {
  if (entityType === "s_corp") return 0.2;
  if (entityType === "llc") return 0.25;
  return 0.3; // sole proprietor default (SE tax + income tax)
}

export default function CashFlowSimulator() {
  const { user } = useAuth();
  const [form, setForm] = useState<SimulationInput>(EMPTY_FORM);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [committed, setCommitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await fetchRecentTransactions(user.id);
      if (res.success) {
        if (res.data) {
          setTransactions(res.data);
        }
      } else {
        toast.error(res.error?.message || "An error occurred");
      }
    })();
  }, [user]);

  const { safeToSpend, netProfit, entityType } = useTaxProfileStore();
  const taxRate = deriveTaxRate(entityType);

  // Derive monthly expenses from transactions within last 30 days
  const monthlyExpenses = useMemo(() => {
    const cutoff = new Date(new Date().setDate(new Date().getDate() - 30));
    return transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          new Date(t.createdAt).getTime() > cutoff.getTime(),
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const handleSimulate = () => {
    if (!form.amount || form.amount <= 0) return;
    const res = simulate(form, {
      safeToSpend,
      netProfit,
      monthlyExpenses,
      taxRate,
    });
    setResult(res);
    setCommitted(false);
  };

  const handleCommit = () => {
    if (!result) return;
    if (!user) return;
    startTransition(async () => {
      const res = await commitTransaction(user.id, {
        type: form.type,
        amount: form.amount,
        note: form.note || `Simulated ${form.type}`,
        deductible: form.deductible,
      });
      if (res.success) {
        setCommitted(true);
      } else {
        toast.error(res.error?.message || "An error occurred");
      }
    });
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setResult(null);
    setCommitted(false);
  };

  return (
    <div className="w-full p-px bg-linear-to-b from-(--accent-cyan) via-(--background-elevated) to-(--background-sidebar) rounded-lg">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-3 h-full">
        {/* Header */}
        <header className="flex items-center justify-between border-b-2 background-border pb-3">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-(--accent-cyan)" />
            <h1 className="primary-slate uppercase font-semibold text-lg">
              Cash Flow Impact Simulator
            </h1>
          </div>
          {result && (
            <button
              onClick={handleReset}
              className="primary-slate hover:text-(--accent-cyan) transition-colors"
            >
              <RotateCcw size={13} />
            </button>
          )}
        </header>

        {/* Input form */}
        <div className="flex flex-col gap-2 text-xs">
          {/* Type toggle */}
          <div className="flex rounded-md overflow-hidden border background-border">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`flex-1 py-1.5 capitalize transition-colors ${
                  form.type === t
                    ? t === "expense"
                      ? "bg-(--accent-red)/20 text-(--accent-red) border-(--accent-red)/40"
                      : "bg-(--accent-green)/20 text-(--accent-green) border-(--accent-green)/40"
                    : "primary-slate hover:text-(--accent-cyan)"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount + note */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 primary-slate">
                $
              </span>
              <input
                type="number"
                min="0"
                placeholder="Amount"
                value={form.amount || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: Number(e.target.value) }))
                }
                className="w-full bg-transparent border background-border rounded pl-5 pr-2 py-1.5 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
              />
            </div>
            <input
              placeholder="Label (optional)"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="flex-1 bg-transparent border background-border rounded px-2 py-1.5 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
            />
          </div>

          {/* Recurring + deductible */}
          <div className="flex gap-4 px-1">
            {[
              { key: "isRecurring", label: "Recurring (monthly)" },
              { key: "deductible", label: "Tax deductible" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-1.5 primary-slate cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={form[key as keyof SimulationInput] as boolean}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.checked }))
                  }
                  className="accent-(--accent-cyan)"
                />
                {label}
              </label>
            ))}
          </div>

          {/* Simulate button */}
          <button
            onClick={handleSimulate}
            disabled={!form.amount || form.amount <= 0}
            className="w-full py-2 rounded bg-(--accent-cyan) hover:bg-(--accent-cyan)/80 text-white font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Simulate Impact
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="flex flex-col gap-2 mt-1">
            <div className="grid grid-cols-3 gap-2">
              {/* Safe to Spend */}
              <div className="flex flex-col gap-0.5 p-2.5 rounded-md bg-white/5 border border-white/10">
                <span className="text-[10px] primary-slate uppercase tracking-wide">
                  Safe to Spend
                </span>
                <span
                  className={`text-sm font-bold ${result.newSafeToSpend >= 0 ? "text-primary" : "text-(--accent-red)"}`}
                >
                  $
                  {result.newSafeToSpend.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
                <DeltaBadge value={result.netProfitChange} />
              </div>

              {/* Net Profit */}
              <div className="flex flex-col gap-0.5 p-2.5 rounded-md bg-white/5 border border-white/10">
                <span className="text-[10px] primary-slate uppercase tracking-wide">
                  Net Profit Δ
                </span>
                <div className="flex items-center gap-1">
                  {result.netProfitChange >= 0 ? (
                    <TrendingUp size={13} className="text-(--accent-green)" />
                  ) : (
                    <TrendingDown size={13} className="text-(--accent-red)" />
                  )}
                  <DeltaBadge value={result.netProfitChange} />
                </div>
              </div>

              {/* Cash Buffer */}
              <div className="flex flex-col gap-0.5 p-2.5 rounded-md bg-white/5 border background-border">
                <span className="text-[10px] primary-slate uppercase tracking-wide">
                  Buffer Days
                </span>
                <span
                  className={`text-sm font-bold ${result.cashBufferDays < 30 ? "text-(--accent-red)" : result.cashBufferDays < 60 ? "text-(--accent-amber)" : "text-primary"}`}
                >
                  {result.cashBufferDays > 900 ? "∞" : result.cashBufferDays}d
                </span>
              </div>
            </div>

            {/* Recurring impact */}
            {form.isRecurring && (
              <div className="flex justify-between px-2.5 py-2 rounded-md bg-white/5 border background-border text-xs primary-slate">
                <span>
                  Monthly impact: <DeltaBadge value={result.monthlyImpact} />
                </span>
                <span>
                  Annual impact: <DeltaBadge value={result.annualImpact} />
                </span>
              </div>
            )}

            {/* Commit / committed */}
            {!committed ? (
              <button
                onClick={handleCommit}
                disabled={isPending}
                className="w-full py-1.5 rounded border border-(--accent-cyan) text-(--accent-cyan) hover:bg-(--accent-cyan)/10 text-xs font-medium transition-colors disabled:opacity-40"
              >
                {isPending ? "Saving..." : "Commit as Real Transaction"}
              </button>
            ) : (
              <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs text-(--accent-green)">
                <CheckCircle size={13} />
                Transaction committed
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
