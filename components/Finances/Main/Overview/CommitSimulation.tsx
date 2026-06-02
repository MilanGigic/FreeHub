"use client";

import { commitTransaction } from "@/actions/finances/commitTransaction";
import { Input } from "@/components/ui/input";
import { transactionCategories, TransactionCategory } from "@/config/constants";
import { getCurrencySymbol } from "@/lib/getCurrencySymbol";
import { useClientStore } from "@/lib/store/useClientStore";
import { useDataStore } from "@/lib/store/useDataStore";
import { Client, Currency, Project } from "@/types/types";
import { SimulationInput, SimulationResult } from "@/utils/simulateCashFlow";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { EMPTY_FORM } from "./TransactionSimulator";

type CommitSimulationProps = {
  user: {
    id: string;
    email: string;
    userName: string;
  } | null;
  form: SimulationInput;
  setForm: Dispatch<SetStateAction<SimulationInput>>;
  result: SimulationResult | null;
  setResult: Dispatch<SetStateAction<SimulationResult | null>>;
  setCommitted: Dispatch<SetStateAction<boolean>>;
  setRealTransaction: Dispatch<SetStateAction<boolean>>;
};

export default function CommitSimulation({
  user,
  form,
  setForm,
  result,
  setResult,
  setCommitted,
  setRealTransaction,
}: CommitSimulationProps) {
  const t = useTranslations("finances");
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("transactions.categories");

  const { projects } = useDataStore();
  const { clients } = useClientStore();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<TransactionCategory>("other");

  const [isPending, startTransition] = useTransition();

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
        currency: "RSD",
        isRecurring: form.isRecurring,
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

  return (
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
      <div className="flex gap-2 justify-between">
        <div>
          <select
            id="currency"
            className="p-2 border background-border rounded-lg outline-none focus:border-(--accent-cyan)/60 transition-all duration-300 text-primary background-elevated"
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
        onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
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
  );
}
