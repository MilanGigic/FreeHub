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
import { toast } from "react-toastify";
import { useAuth } from "@/lib/useAuth";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { fetchRecentTransactions } from "@/actions/finances/fetchRecentTransactions";
import { useDataStore } from "@/lib/store/useDataStore";
import { Client, Project } from "@/types/types";
import { useTranslations } from "next-intl";
import { transactionCategories, TransactionCategory } from "@/config/constants";
import { Input } from "@/components/ui/input";
import { useClientStore } from "@/lib/store/useClientStore";

const EMPTY_FORM: SimulationInput = {
  type: "expense",
  amount: 0,
  isRecurring: false,
  note: "",
  deductible: false,
  merchant: "",
  title: "",
  projectId: "",
  clientId: "",
  transactionDate: "",
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

export default function TransactionSimulator() {
  const { user } = useAuth();
  const t = useTranslations("finances");
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("transactions.categories");
  const [form, setForm] = useState<SimulationInput>(EMPTY_FORM);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [committed, setCommitted] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isPending, startTransition] = useTransition();
  const [realTransaction, setRealTransaction] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<TransactionCategory>("other");

  const { transactions, setTransactions, projects } = useDataStore();
  const { clients } = useClientStore();

  // FIX SIMULATION LOGIC

  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await fetchRecentTransactions(user.id);
      if (res.success) {
        if (res.data) {
          setTransactions(res.data);
        }
      } else {
        toast.error(res.error?.message || tCommon("anErrorOccurred"));
      }
    })();
  }, [user, setTransactions, tCommon]);

  const { safeToSpend, taxResult } = useTaxProfileStore();
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

  const handleCommit = () => {
    if (!result) return;
    if (!user) return;
    startTransition(async () => {
      const res = await commitTransaction(user.id, {
        type: form.type,
        amount: form.amount,
        title: form.title ?? "",
        merchant: form.merchant ?? "",
        category: selectedCategory ?? null,
        note:
          form.note ||
          (form.type === "expense"
            ? t("simulatedExpense")
            : t("simulatedIncome")),
        transactionDate: new Date().toLocaleDateString(),
        deductible: form.deductible,
        projectId: form.projectId || null,
        clientId: form.clientId || null,
      });
      if (res.success) {
        setCommitted(true);
        setRealTransaction(false);
        setForm(EMPTY_FORM);
        setResult(null);
      } else {
        toast.error(res.error?.message || tCommon("anErrorOccurred"));
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
      {!realTransaction ? (
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
              <div className="relative flex-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 primary-slate">
                  $
                </span>
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, note: e.target.value }))
                }
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
                    {t("netProfitDelta")}
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
                    {t("monthlyImpact")}{" "}
                    <DeltaBadge value={result.monthlyImpact} />
                  </span>
                  <span>
                    {t("annualImpact")}{" "}
                    <DeltaBadge value={result.annualImpact} />
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
      ) : (
        <div className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-3 h-full">
          <select
            className="w-full text-center py-1.5 rounded border border-(--accent-cyan) text-(--accent-cyan) text-xs font-medium transition-colors disabled:opacity-40"
            value={selectedProject?.id ?? ""}
            onChange={(e) =>
              setSelectedProject(
                projects.find((p) => p.id === e.target.value) as Project,
              )
            }
          >
            <option value="">{t("selectProject")}</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            className="w-full text-center py-1.5 rounded border border-(--accent-cyan) text-(--accent-cyan) text-xs font-medium transition-colors disabled:opacity-40"
            value={selectedClient?.id ?? ""}
            onChange={(e) =>
              setSelectedClient(
                clients.find((c) => c.id === e.target.value) as Client,
              )
            }
          >
            <option value="">{t("selectClient")}</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.clientName}
              </option>
            ))}
          </select>
          <select
            className="w-full text-center py-1.5 rounded border border-(--accent-cyan) text-(--accent-cyan) text-xs font-medium transition-colors disabled:opacity-40"
            value={selectedCategory ?? ""}
            onChange={(e) =>
              setSelectedCategory(e.target.value as TransactionCategory)
            }
          >
            <option value="">{tCommon("categories")}</option>
            {transactionCategories.map((category, index) => (
              <option key={index} value={category}>
                {tCategories(`${category}`)}
              </option>
            ))}
          </select>
          <Input
            value={form.title!}
            placeholder={t("enterTitle")}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="bg-transparent border background-border rounded px-2 py-1.5 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
          />
          <Input
            value={form.merchant!}
            placeholder={t("enterMerchant")}
            onChange={(e) => setForm({ ...form, merchant: e.target.value })}
            className="bg-transparent border background-border rounded px-2 py-1.5 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
          />
          <Input
            value={form.note!}
            placeholder={t("enterNote")}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="bg-transparent border background-border rounded px-2 py-1.5 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
          />
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
          <Input
            type="date"
            id="transactionDate"
            className="bg-transparent border background-border rounded px-2 py-1.5 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
            value={form.transactionDate || ""}
            onChange={(e) =>
              setForm({ ...form, transactionDate: e.target.value })
            }
          />
          <button
            onClick={handleCommit}
            disabled={isPending}
            className="w-full py-1.5 rounded border border-(--accent-cyan) text-(--accent-cyan) hover:bg-(--accent-cyan)/10 text-xs font-medium transition-colors disabled:opacity-40"
          >
            {isPending ? t("saving") : t("commitAsRealTransaction")}
          </button>
          <button
            onClick={() => setRealTransaction(false)}
            disabled={isPending}
            className="w-full py-1.5 rounded border border-(--accent-red) text-(--accent-red) hover:bg-(--accent-red)/10 text-xs font-medium transition-colors disabled:opacity-40"
          >
            {isPending ? t("saving") : t("backToSimulator")}
          </button>
        </div>
      )}
    </div>
  );
}
