"use client";

import { addExpense } from "@/actions/projects/revenue/addExpense";
import { fetchExpenseData } from "@/actions/projects/revenue/fetchExpenseData";
import { Checkbox } from "@/components/ui/checkbox";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useAuth } from "@/lib/useAuth";
import { ProjectRevenue } from "@/types/types";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Expenses() {
  const { user } = useAuth();
  const { selectedProject, setProfit } = useProjectStore();

  const [expenses, setExpenses] = useState<string>("0");
  const [expenseNote, setExpenseNote] = useState<string>("");
  const [deductible, setDeductible] = useState<boolean>(false);

  const [expenseList, setExpenseList] = useState<ProjectRevenue[]>([]);

  useEffect(() => {
    (async () => {
      if (!selectedProject) return;

      const expenseRes = await fetchExpenseData(selectedProject.id);

      if (expenseRes.success) {
        if (expenseRes.data) {
          if (expenseRes.data.length > 0) {
            setExpenseList(expenseRes.data);
          }
        }
      } else {
        toast.error(expenseRes.error as string);
      }
    })();
  }, [selectedProject]);

  const handleAddExpense = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    if (!selectedProject) return;
    if (!expenses) return;

    const res = await addExpense(
      user.id,
      selectedProject.id,
      expenses,
      expenseNote,
      deductible,
    );

    if (res.success) {
      if (res.data) {
        setExpenseList([...expenseList, res.data]);
        setExpenses("0");
        setExpenseNote("");
        toast.success("Expense added successfully");
      }

      if (res.projectData) {
        setProfit(res.projectData.totalProfit ?? "0");
      } else {
        console.log("Error setting profit");
      }
    } else {
      console.error(res.error);
      toast.error(res.error as string);
    }
  };

  return (
    <div className="flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 w-full primary-slate">
      <form
        onSubmit={(e) => handleAddExpense(e)}
        className="flex flex-col gap-2 md:gap-4 border-b-2 background-border pb-4"
      >
        <p className="text-lg primary-slate uppercase font-semibold">
          Expenses:
          <span className="primary-green">${expenses}</span>
        </p>

        <div>
          <label
            htmlFor="expenses"
            className="text-lg font-semibold uppercase primary-slate"
          >
            Expenses
          </label>
          <input
            type="number"
            id="expenses"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            className="w-full p-2 border background-border rounded-lg focus:outline focus:outline-(--accent-cyan) text-primary"
          />
        </div>

        <div>
          <label
            htmlFor="note"
            className="text-lg font-semibold uppercase primary-slate"
          >
            Note:
          </label>

          <input
            type="text"
            id="note"
            value={expenseNote}
            onChange={(e) => setExpenseNote(e.target.value)}
            className="w-full p-2 border background-border rounded-lg focus:outline focus:outline-(--accent-cyan) text-primary"
          />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <div className="flex items-center gap-2">
            <label
              htmlFor="deductible"
              className="text-lg font-semibold uppercase primary-slate"
            >
              Deductible:
            </label>
            <Checkbox
              id="deductible"
              checked={deductible}
              onCheckedChange={(checked) => setDeductible(checked === true)}
            />
          </div>
          <p className="text-xs primary-slate">
            Only check if this qualifies as a business expense per IRS rules
            (e.g., home office, mileage).
          </p>
        </div>
        <button
          type="submit"
          className={`p-2 w-full border rounded-lg cursor-pointer transition-all
              border-(--accent-red) hover:bg-(--accent-red)/20
              `}
        >
          New Expense
        </button>
      </form>

      <div className="flex flex-col gap-2">
        <h1 className="text-lg primary-slate uppercase font-semibold">
          Expenses History:
        </h1>
        {expenseList.map((expense) => (
          <div key={expense.id} className="flex">
            <h1 className="primary-red">${expense.amount}</h1>
            <p className="text-secondary text-sm font-semibold">
              {expense.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
