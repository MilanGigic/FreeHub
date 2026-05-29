"use client";

import { commitTransaction } from "@/actions/finances/commitTransaction";
import { fetchProjectById } from "@/actions/projects/fetchProjectById";
import { useAuth } from "@/lib/useAuth";
import { Project } from "@/types/types";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useDataStore } from "@/lib/store/useDataStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { TransactionCategory } from "@/config/constants";
import { Spinner } from "../ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transactionCategories } from "@/config/constants";
import { useClientStore } from "@/lib/store/useClientStore";

export default function AddTransactionModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const t = useTranslations("transactions");
  const tCategories = useTranslations("transactions.categories");
  const tCommon = useTranslations("common");
  const p = useTranslations("projects");

  const { user } = useAuth();
  const { setTransactions, projects } = useDataStore();
  const { clients } = useClientStore();

  const { setSelectedProject } = useProjectStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [form, setForm] = useState<{
    type: "income" | "expense";
    amount: string;
    title: string;
    merchant: string;
    projectId: string;
    clientId: string;
    note: string;
    transactionDate: string;
    deductible: boolean;
  }>({
    type: "income" as "income" | "expense",
    amount: "0",
    title: "",
    merchant: "",
    projectId: "",
    clientId: "",
    note: "",
    transactionDate: "",
    deductible: false,
  });

  const [selectedCategory, setSelectedCategory] =
    useState<TransactionCategory>("other");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      console.log("No user found, returning early from submit.");
      return;
    }

    setIsLoading(true);
    const transactionData = {
      type: form.type,
      amount: Number(form.amount),
      title: form.title,
      merchant: form.merchant,
      category: selectedCategory,
      note: form.note || "",
      transactionDate: form.transactionDate,
      deductible: form.deductible,
      projectId: form.projectId ? form.projectId : null,
      clientId: form.clientId ? form.clientId : null,
    };
    console.log("Submitting transaction with data:", transactionData);

    const res = await commitTransaction(user.id, transactionData);

    console.log("Result from commitTransaction:", res);

    if (res.success) {
      onClose();
      toast.success(t("transactionAddedSuccess"));
      if (res.data) {
        setTransactions(res.data);
        console.log("Transaction added to store:", res.data);
      }
      const refreshed = await fetchProjectById(form.projectId);
      console.log("Refetched project after transaction:", refreshed);

      if (refreshed.success && refreshed.data) {
        setSelectedProject(refreshed.data as Project);
        console.log("Updated selectedProject in store:", refreshed.data);
      }
      setIsLoading(false);
    } else {
      console.error("Error occurred during transaction commit:", res.error);
      toast.error(res.error?.message || tCommon("anErrorOccurred"));
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 15 }}
      className="lg:fixed lg:inset-0 absolute top-full bg-black/50 flex items-center justify-center z-50"
    >
      <button
        onClick={onClose}
        className="absolute top-0 right-0 lg:top-16 lg:right-16 p-1"
      >
        <X className="w-8 h-8 lg:w-12 lg:h-12 lg:p-2 text-primary transition-all border background-border rounded-full hover:cursor-pointer hover:text-(--accent-red) hover:border-(--accent-red) duration-300" />
      </button>

      <form
        className="flex flex-col gap-2 md:gap-4 border-b-2 background-border background-elevated p-4 rounded-2xl"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div>
          <label
            htmlFor="type"
            className="text-lg font-semibold uppercase primary-slate"
          >
            {t("typeLabel")}
          </label>
          <select
            id="type"
            className="w-full p-2 border background-border rounded-lg outline-none focus:border-(--accent-cyan)/60 transition-all duration-300 text-primary background-elevated"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as "income" | "expense" })
            }
          >
            <option value="income">{t("incomeOption")}</option>
            <option value="expense">{t("expenseOption")}</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="amount"
            className="text-lg font-semibold uppercase primary-slate"
          >
            {t("amountLabel")}
          </label>
          <input
            type="number"
            id="amount"
            className="w-full p-2 border background-border rounded-lg outline-none focus:border-(--accent-cyan)/60 transition-all duration-300 text-primary"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor="title"
            className="text-lg font-semibold uppercase primary-slate"
          >
            {tCommon("name")}
          </label>
          <input
            type="text"
            id="title"
            className="w-full p-2 border background-border rounded-lg outline-none focus:border-(--accent-cyan)/60 transition-all duration-300 text-primary"
            value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor="merchant"
            className="text-lg font-semibold uppercase primary-slate"
          >
            {tCommon("merchant")} / {tCommon("vendor")} / {p("client")}
          </label>
          <input
            type="text"
            id="merchant"
            className="w-full p-2 border background-border rounded-lg outline-none focus:border-(--accent-cyan)/60 transition-all duration-300 text-primary"
            value={form.merchant || ""}
            onChange={(e) => setForm({ ...form, merchant: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor="note"
            className="text-lg font-semibold uppercase primary-slate"
          >
            {t("noteLabel")}
          </label>
          <input
            type="text"
            id="note"
            className="w-full p-2 border background-border rounded-lg outline-none focus:border-(--accent-cyan)/60 transition-all duration-300 text-primary"
            value={form.note || ""}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-4">
          <label
            htmlFor="transactionDate"
            className="text-lg font-semibold uppercase primary-slate"
          >
            {t("transactionDate")}
          </label>
          <input
            type="date"
            id="transactionDate"
            className="rounded-md background-elevated border background-border p-4 outline-none text-sm text-primary focus-border-accent transition-all min-h-[44px] touch-manipulation w-full"
            value={form.transactionDate || ""}
            onChange={(e) =>
              setForm({ ...form, transactionDate: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-semibold uppercase primary-slate">
            {tCategories(selectedCategory)}
          </h1>
          <Select
            value={selectedCategory}
            onValueChange={(value) =>
              setSelectedCategory(value as TransactionCategory)
            }
          >
            <SelectTrigger
              className="w-full text-primary h-full border-b-2 pb-2"
              type="button"
            >
              <SelectValue
                className="text-primary"
                placeholder={tCommon("selectCategory")}
              />
            </SelectTrigger>
            <SelectContent className="text-primary background-elevated">
              <SelectGroup className="max-h-[300px] overflow-y-scroll p-2 border background-border background-elevated">
                <SelectLabel>{tCommon("categories")}</SelectLabel>
                {transactionCategories.map((category, index) => (
                  <SelectItem
                    key={index}
                    value={category}
                    className="p-2 cursor-pointer hover:bg-white/15 transition-all duration-300"
                  >
                    {tCategories(category)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-semibold uppercase primary-slate flex flex-col">
            {p("title")}{" "}
            <span className="text-sm font-normal tracking-wider primary-slate">
              ({tCommon("optional")})
            </span>
          </h1>
          <Select
            value={form.projectId}
            onValueChange={(value) => setForm({ ...form, projectId: value })}
          >
            <SelectTrigger
              className="w-full text-primary h-full border-b-2 pb-2"
              type="button"
            >
              <SelectValue
                className="text-primary"
                placeholder={p("selectProject")}
              />
            </SelectTrigger>
            <SelectContent className="text-primary background-elevated">
              <SelectGroup className="max-h-[300px] overflow-y-scroll p-2 border background-border background-elevated">
                <SelectLabel>{p("projects")}</SelectLabel>
                {projects.map((project) => (
                  <SelectItem
                    key={project.id}
                    value={project.id}
                    className="p-2 cursor-pointer hover:bg-white/15 transition-all duration-300"
                  >
                    {project.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-sm uppercase primary-slate">
            {p("projectProfitabilityTracking")}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-semibold uppercase primary-slate flex flex-col">
            {p("selectClient")}{" "}
            <span className="text-sm font-normal tracking-wider primary-slate">
              ({tCommon("optional")})
            </span>
          </h1>
          <Select
            value={form.clientId}
            onValueChange={(value) => setForm({ ...form, clientId: value })}
          >
            <SelectTrigger
              className="w-full text-primary h-full border-b-2 pb-2"
              type="button"
            >
              <SelectValue
                className="text-primary"
                placeholder={p("selectClient")}
              />
            </SelectTrigger>
            <SelectContent className="text-primary background-elevated">
              <SelectGroup className="max-h-[300px] overflow-y-scroll p-2 border background-border background-elevated">
                <SelectLabel>{tCommon("clients")}</SelectLabel>
                {clients.map((client) => (
                  <SelectItem
                    key={client.id}
                    value={client.id}
                    className="p-2 cursor-pointer hover:bg-white/15 transition-all duration-300"
                  >
                    {client.clientName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-sm uppercase primary-slate">
            {p("clientProfitabilityTracking")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="deductible"
            className="text-lg font-semibold uppercase primary-slate"
          >
            {t("deductible")}
          </label>
          <input
            type="checkbox"
            id="deductible"
            className="p-2 "
            checked={form.deductible}
            onChange={(e) => setForm({ ...form, deductible: e.target.checked })}
          />
        </div>
        <button
          type="submit"
          className="w-full cursor-pointer p-2 border background-border rounded-lg outline-none hover:border-(--accent-green) hover:bg-(--accent-green)/30 text-primary primary-slate hover:text-primary uppercase font-semibold transition-all duration-300"
        >
          {isLoading ? <Spinner /> : tCommon("confirm")}
        </button>
      </form>
    </motion.div>
  );
}
