"use client";

import { addExpense } from "@/actions/projects/revenue/addExpense";
import { addIncome } from "@/actions/projects/revenue/addIncome";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { Project, User } from "@/types/types";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

export default function RenderCard({
  card,
  selectedProject,
  user,
  revenue,
  expenses,
  setRevenue,
  setExpenses,
}: {
  card: {
    label: string;
    value: string;
    onChange: (value: string) => void;
  };
  selectedProject: Project | null;
  user: User | null;
  revenue: string;
  expenses: string;
  setRevenue: (value: string) => void;
  setExpenses: (value: string) => void;
}) {
  const [revenueNote, setRevenueNote] = useState<string>("");
  const [expenseNote, setExpenseNote] = useState<string>("");

  const {
    revenueList,
    setRevenueList,
    expenseList,
    setExpenseList,
    paidInvoices,
  } = useProjectStore();

  const handleAddRevenue = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProject) return;
    if (!user) return;

    const result = await addIncome(
      user.id,
      selectedProject.id,
      revenue,
      revenueNote,
    );

    if (result.success) {
      if (result.data) {
        setRevenueList([...revenueList, result.data]);
        console.log("Revenue list:", revenueList);
        setRevenue("0");
        setRevenueNote("");
        toast.success("Revenue added successfully");
      }
    }
  };

  const handleAddExpense = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProject) return;
    if (!user) return;

    const result = await addExpense(
      user.id,
      selectedProject.id,
      expenses,
      expenseNote,
    );

    if (result.success) {
      if (result.data) {
        setExpenseList([...expenseList, result.data]);
        console.log("Expense list:", result.data);
        setExpenses("0");
        setExpenseNote("");
        toast.success("Expense added successfully");
      }
    } else {
      toast.error((result as { error: string }).error);
    }
  };

  return (
    <div
      key={card.label}
      className="flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 w-full primary-slate"
    >
      <form
        onSubmit={(e) =>
          card.label === "Revenue"
            ? handleAddRevenue(e)
            : card.label === "Expenses"
              ? handleAddExpense(e)
              : undefined
        }
        className="flex flex-col gap-2 md:gap-4 border-b-2 background-border pb-4"
      >
        <p className="text-lg primary-slate uppercase font-semibold">
          {card.label}:
          <span
            className={`${card.label === "Revenue" ? "primary-green" : card.label === "Expenses" ? "primary-red" : card.label === "Profit" ? "primary-cyan" : card.label === "Margin" ? "primary-amber" : "primary-purple"}`}
          >
            ${card.value}
          </span>
        </p>
        <div>
          <label htmlFor={card.label}>{card.label}</label>
          <input
            type="number"
            id={card.label}
            value={card.value}
            onChange={(e) => card.onChange(e.target.value)}
            className="w-full p-2 border background-border rounded-lg focus:outline focus:outline-(--accent-cyan) text-primary"
          />
        </div>
        <div>
          <label htmlFor="note">Note:</label>

          <input
            type="text"
            id="note"
            value={card.label === "Revenue" ? revenueNote : expenseNote}
            onChange={(e) =>
              card.label === "Revenue"
                ? setRevenueNote(e.target.value)
                : setExpenseNote(e.target.value)
            }
            className="w-full p-2 border background-border rounded-lg focus:outline focus:outline-(--accent-cyan) text-primary"
          />
        </div>
        <button
          type="submit"
          className={`p-2 w-full border rounded-lg cursor-pointer transition-all
              ${card.label === "Revenue" ? "border-(--accent-green) hover:bg-(--accent-green)/20" : card.label === "Expenses" ? "border-(--accent-red) hover:bg-(--accent-red)/20" : "border-(--accent-cyan) hover:bg-(--accent-cyan)/20"}
              `}
        >
          New <span className="capitalize">{card.label}</span>
        </button>
      </form>

      <div className="flex flex-col gap-2 md:gap-4">
        <h1 className="text-lg primary-slate uppercase font-semibold text-center">
          {card.label} History:
        </h1>
        {card.label === "Revenue" ? (
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-between">
            <div className="w-full flex flex-col gap-2 md:gap-4 items-start h-full">
              <h1 className="text-lg primary-slate uppercase font-semibold">
                Revenue:
              </h1>
              {/* Project revenue entries */}
              {revenueList.map((item) => (
                <div
                  key={item.id}
                  className="border-b-2 background-border w-full"
                >
                  <p className="flex items-center gap-2">
                    ${String(item.amount)} -
                    <span className="primary-slate text-sm">{item.note}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="border background-border h-full"></div>

            {/* Paid invoices contributing to revenue */}
            <div className="w-full flex flex-col gap-2 md:gap-4 items-start h-full">
              <h1 className="text-lg primary-slate uppercase font-semibold">
                Invoices:
              </h1>
              {paidInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border-b-2 background-border w-full"
                >
                  <p className="flex items-center gap-2">
                    ${String(invoice.totalAmount)} -
                    <span className="primary-slate text-sm">
                      {invoice.note ?? "Invoice payment"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : card.label === "Expenses" ? (
          <div className="w-full flex flex-col gap-2 md:gap-4 items-start h-full">
            {expenseList.map((item) => (
              <div
                key={item.id}
                className="border-b-2 background-border w-full"
              >
                <p className="flex items-center gap-2">
                  ${String(item.amount)} -
                  <span className="primary-slate text-sm">{item.note}</span>
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
