"use client";

import { addInvoice, addToDrafts } from "@/actions/invoices/addInvoice";
import { fetchAllClientProjects } from "@/actions/projects/fetchAllClientProjects";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { transactionCategories, TransactionCategory } from "@/config/constants";
import { useClientStore } from "@/lib/store/useClientStore";
import { useDataStore } from "@/lib/store/useDataStore";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useAuth } from "@/lib/useAuth";
import { Currency, Project } from "@/types/types";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function NewInvoiceForm({ onClose }: { onClose: () => void }) {
  const t = useTranslations("invoices");
  const tTransactions = useTranslations("transactions");
  const tCommon = useTranslations("common");
  const p = useTranslations("projects");
  const tCategories = useTranslations("transactions.categories");
  const { user } = useAuth();
  const { selectedClient } = useClientStore();
  const { projects, setProjects } = useDataStore();
  const {
    selectedProject,
    setSelectedProject,
    projectFinances,
    setProjectFinances,
  } = useProjectStore();
  const {
    invoices,
    setInvoices,
    amount,
    setAmount,
    issueDate,
    setIssueDate,
    dueDate,
    setDueDate,
    note,
    setNote,
    merchantName,
    title,
    setTitle,
    setMerchantName,
    setOutstandingInvoices,
    setOverdueInvoices,
    setPaidInvoices,
    currency,
    setCurrency,
  } = useInvoiceStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<TransactionCategory | null>(null);

  useEffect(() => {
    (async () => {
      if (!selectedClient || !user) return;

      const res = await fetchAllClientProjects(selectedClient.id, user.id);
      if (res.success) {
        if (res.data) {
          setProjects(res.data);
        }
      }
    })();
  }, [selectedClient, setProjects, user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submit triggered for new invoice.");

    if (!selectedClient || !user || !selectedProject) {
      console.log("No selected client found. Exiting submission handler.");
      return;
    }

    if (isSubmitting) {
      console.log(
        "Invoice submission already in progress. Ignoring duplicate submit.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Calling addInvoice with values:", {
        amount,
        issueDate,
        dueDate,
        note,
        clientId: selectedClient.id,
        projectId: selectedProject.id,
      });
      const res = await addInvoice(
        title!,
        currency as Currency,
        merchantName!,
        selectedCategory!,
        amount,
        issueDate,
        dueDate,
        note,
        selectedClient.id,
        user.id,
        selectedProject.id,
      );

      if (!res.success) {
        console.log("Invoice creation failed:", res.error);
        toast.error(res.error);
      } else if (res.data) {
        console.log(
          "Invoice created successfully. Updating state with new invoice.",
        );
        setInvoices([...invoices, res.data]);
        if (res.outstandingInvoices) {
          setOutstandingInvoices(res.outstandingInvoices);
        }
        if (res.overdueInvoices) {
          setOverdueInvoices({
            data: res.overdueInvoices.data,
            count: res.overdueInvoices.count,
          });
        }
        if (res.paidInvoices) {
          setPaidInvoices(res.paidInvoices);
        }
        toast.success(t("invoiceCreatedSuccess"));
        setSelectedProject(null);
        setAmount("");
        setIssueDate(new Date());
        setDueDate(new Date());
        setNote("");
      }
    } catch (error) {
      console.error("Error adding invoice:", error);
    } finally {
      onClose();
      setIsSubmitting(false);
    }
  };

  const handleAddToDrafts = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selectedClient || !user || !selectedProject) return;
    console.log("Calling addToDrafts with values:", {
      amount,
      issueDate,
      dueDate,
      note,
      clientId: selectedClient.id,
      projectId: selectedProject.id,
    });

    try {
      const res = await addToDrafts(
        title!,
        currency as Currency,
        merchantName!,
        selectedCategory!,
        amount,
        issueDate,
        dueDate,
        note,
        selectedClient.id,
        user.id,
        selectedProject.id,
      );

      if (!res.success) {
        toast.error(res.error as string);
        console.log("Error adding to drafts:", res.error);
      } else if (res.data) {
        setInvoices([...invoices, res.data]);
        toast.success(t("invoiceDraftedSuccess"));
        setSelectedProject(null);
        setAmount("");
        setIssueDate(new Date());
        setDueDate(new Date());
        setNote("");
      }
    } catch (error) {
      console.error("Error adding to drafts:", error);
      toast.error(error as string);
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 max-w-2xl w-full absolute top-16 right-0 primary-slate animate-flip-down animate-duration-1500 animate-ease-out"
    >
      <button onClick={onClose}>
        <X className="w-12 h-12 text-primary transition-all border background-border rounded-full hover:cursor-pointer hover:text-(--accent-red) hover:border-(--accent-red)" />
      </button>
      {/* AMOUNT INPUT */}
      <div>
        <label
          htmlFor="amount"
          className="primary-slate font-semibold uppercase"
        >
          {t("amountLabel")}
        </label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full p-2 border background-border rounded-lg text-primary focus:outline focus:outline-(--accent-cyan)"
        />
      </div>
      {/*  */}

      {/* TITLE */}
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
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {/*  */}

      {/* CURRENCY SELECTION */}
      <div>
        <label
          htmlFor="currency"
          className="text-lg font-semibold uppercase primary-slate"
        >
          {tTransactions("currencyLabel")}
        </label>
        <select
          id="currency"
          className="w-full p-2 border background-border rounded-lg outline-none focus:border-(--accent-cyan)/60 transition-all duration-300 text-primary background-elevated"
          value={currency ?? ""}
          onChange={(e) => setCurrency(e.target.value as Currency)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="RSD">RSD</option>
          <option value="CAD">CAD</option>
        </select>
      </div>
      {/*  */}

      {/* MERCHANT NAME */}
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
          value={merchantName || ""}
          onChange={(e) => setMerchantName(e.target.value)}
        />
      </div>
      {/*  */}

      {/* PROJECT SELECTION */}
      <div>
        <label
          htmlFor="project"
          className="primary-slate font-semibold uppercase"
        >
          {t("projectLabel")}
        </label>
        <select
          id="project"
          name="project"
          className="w-full p-2 border background-border rounded-lg text-primary focus:outline focus:outline-(--accent-cyan)"
          value={selectedProject ? selectedProject.id : ""}
          onChange={(e) => {
            const project = projects.find((p) => p.id === e.target.value) as
              | Project
              | undefined;
            if (project) {
              setSelectedProject(project);
              console.log("Selected project:", project);
            }
          }}
        >
          <option value="">{t("selectProject")}</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/*  */}

      {/* CATEGORY SELECTION */}
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold uppercase primary-slate">
          {selectedCategory ? tCategories(selectedCategory) : "Kategorije"}
        </h1>
        <Select
          value={selectedCategory ?? ""}
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
      {/*  */}

      {/* DATE INPUTS */}
      <div className="flex gap-2 md:gap-4 justify-between w-full">
        <div className="w-full">
          <label
            htmlFor="issueDate"
            className="primary-slate font-semibold uppercase"
          >
            {t("issueDate")}
          </label>
          <input
            type="date"
            id="issueDate"
            value={issueDate.toISOString().split("T")[0]}
            onChange={(e) => setIssueDate(new Date(e.target.value))}
            required
            className="w-full p-2 border background-border rounded-lg text-primary focus:outline focus:outline-(--accent-cyan)"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="dueDate"
            className="primary-slate font-semibold uppercase"
          >
            {t("dueDate")}
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate.toISOString().split("T")[0]}
            onChange={(e) => setDueDate(new Date(e.target.value))}
            required
            className="w-full p-2 border background-border rounded-lg text-primary focus:outline focus:outline-(--accent-cyan)"
          />
        </div>
      </div>
      {/*  */}

      {/* NOTE INPUT */}
      <div>
        <label htmlFor="note" className="primary-slate font-semibold uppercase">
          {t("noteLabel")}
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border background-border rounded-lg text-primary focus:outline focus:outline-(--accent-cyan)"
        />
      </div>
      {/*  */}

      {/* BUTTONS */}
      <div className="flex gap-2 md:gap-4 justify-between w-full">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg background-elevated border w-full px-4 py-2 outline-none border-(--accent-green) transition-all cursor-pointer primary-slate uppercase font-semibold hover:bg-(--accent-green)/40"
        >
          {t("createInvoice")}
        </button>
        <button
          type="button"
          onClick={(e) => handleAddToDrafts(e)}
          className="rounded-lg background-elevated border w-full px-4 py-2 outline-none border-(--accent-purple) transition-all cursor-pointer primary-slate uppercase font-semibold hover:bg-(--accent-purple)/40"
        >
          {t("saveAsDraft")}
        </button>
      </div>
      {/*  */}
    </form>
  );
}
