"use client";

import { getCurrencySymbol } from "@/lib/getCurrencySymbol";
import { useDataStore } from "@/lib/store/useDataStore";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { Currency } from "@/types/types";
import {
  simulate,
  SimulationInput,
  SimulationResult,
} from "@/utils/simulateCashFlow";
import {
  CheckCircle,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { SetStateAction, Dispatch, useTransition, useMemo } from "react";
import { EMPTY_FORM } from "./TransactionSimulator";
import { useTranslations } from "next-intl";

type SimulationProps = {
  form: SimulationInput;
  setForm: Dispatch<SetStateAction<SimulationInput>>;
  result: SimulationResult | null;
  setResult: Dispatch<SetStateAction<SimulationResult | null>>;
  setCommitted: Dispatch<SetStateAction<boolean>>;
  setRealTransaction: Dispatch<SetStateAction<boolean>>;
  committed: boolean;
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

export default function Simulation({
  form,
  setForm,
  result,
  setResult,
  setCommitted,
  setRealTransaction,
  committed,
}: SimulationProps) {
  const t = useTranslations("finances");
  const [isPending, startTransition] = useTransition();

  const { safeToSpend, taxResult } = useTaxProfileStore();
  const { transactions } = useDataStore();
  const taxRate =
    taxResult.effectiveTaxRate > 0 ? taxResult.effectiveTaxRate : 0.3;

  const { netProfit } = taxResult;
  const { amount } = safeToSpend;

  const monthlyExpenses = useMemo(() => {
    const cutoff = new Date(new Date().setDate(new Date().getDate() - 30));
    return transactions
      .filter(
        (tx) =>
          tx.type === "expense" &&
          new Date(tx.createdAt).getTime() > cutoff.getTime(),
      )
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  }, [transactions]);

  const handleSimulate = () => {
    if (!form.amount || form.amount <= 0) return;
    const res = simulate(form, {
      amount,
      netProfit,
      monthlyExpenses,
      taxRate,
    });
    setResult(res);
    setCommitted(false);
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setResult(null);
    setCommitted(false);
  };
  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-3 h-full">
      {/* Header */}
      <header className="flex items-center justify-between border-b-2 background-border pb-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-(--accent-cyan)" />
          <h1 className="text-lg font-semibold tracking-wider text-primary uppercase">
            {t("cashFlowSimulator")}
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
          {(["expense", "income"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setForm((f) => ({ ...f, type }))}
              className={`flex-1 py-1.5 capitalize transition-colors ${
                form.type === type
                  ? type === "expense"
                    ? "bg-(--accent-red)/20 text-(--accent-red) border-(--accent-red)/40"
                    : "bg-(--accent-green)/20 text-(--accent-green) border-(--accent-green)/40"
                  : "primary-slate hover:text-(--accent-cyan)"
              }`}
            >
              {type === "expense" ? t("expenseToggle") : t("incomeToggle")}
            </button>
          ))}
        </div>

        {/* Amount + note */}
        <div className="flex gap-2">
          <div className="relative flex-1 flex gap-1">
            <div>
              <select
                id="currency"
                className="w-full p-2 border background-border rounded-lg outline-none focus:border-(--accent-cyan)/60 transition-all duration-300 text-primary background-elevated"
                value={form.currency ?? ""}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value as Currency })
                }
              >
                <option value="USD">{getCurrencySymbol("USD")}</option>
                <option value="EUR">{getCurrencySymbol("EUR")}</option>
                <option value="GBP">{getCurrencySymbol("GBP")}</option>
                <option value="JPY">{getCurrencySymbol("JPY")}</option>
                <option value="RSD">{getCurrencySymbol("RSD")}</option>
                <option value="CAD">{getCurrencySymbol("CAD")}</option>
              </select>
            </div>
            <input
              type="number"
              min="0"
              placeholder={t("amountPlaceholder")}
              value={form.amount || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: Number(e.target.value) }))
              }
              className="w-full bg-transparent border background-border rounded pl-5 pr-2 py-1.5 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
            />
          </div>
          <input
            placeholder={t("labelOptional")}
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            className="flex-1 bg-transparent border background-border rounded px-2 py-1.5 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
          />
        </div>

        {/* Recurring + deductible */}
        <div className="flex gap-4 px-1">
          {[
            { key: "isRecurring", label: t("recurringMonthly") },
            { key: "deductible", label: t("taxDeductible") },
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
          {t("simulateImpact")}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-2 mt-1">
          <div className="grid grid-cols-3 gap-2">
            {/* Safe to Spend */}
            <div className="flex flex-col gap-0.5 p-2.5 rounded-md bg-white/5 border border-white/10">
              <span className="text-[10px] primary-slate uppercase tracking-wide">
                {t("safeToSpendResult")}
              </span>
              <span
                className={`text-sm font-bold ${result.newSafeToSpend >= 0 ? "text-primary" : "text-(--accent-red)"}`}
              >
                {result.newSafeToSpend.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                RSD
              </span>
              <DeltaBadge value={result.netProfitChange} />
            </div>

            {/* Net Profit */}
            <div className="flex flex-col gap-0.5 p-2.5 rounded-md bg-white/5 border border-white/10">
              <span className="text-[10px] primary-slate uppercase tracking-wide">
                {t("netProfit")}
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
                {t("bufferDays")}
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
                {t("monthlyImpact")} <DeltaBadge value={result.monthlyImpact} />
              </span>
              <span>
                {t("annualImpact")} <DeltaBadge value={result.annualImpact} />
              </span>
            </div>
          )}

          {/* Commit / committed */}
          {!committed ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setRealTransaction(true)}
                disabled={isPending}
                className="w-full py-1.5 rounded border border-(--accent-cyan) text-(--accent-cyan) hover:bg-(--accent-cyan)/10 text-xs font-medium transition-colors disabled:opacity-40"
              >
                {isPending ? t("saving") : t("continueAsRealTransaction")}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs text-(--accent-green)">
              <CheckCircle size={13} />
              {t("transactionCommitted")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
