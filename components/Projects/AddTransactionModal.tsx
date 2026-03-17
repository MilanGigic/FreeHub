"use client";

import { commitTransaction } from "@/actions/finances/commitTransaction";
import { useAuth } from "@/lib/useAuth";
import { Transaction } from "@/types/types";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDataStore } from "@/lib/store/useDataStore";

export default function AddTransactionModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { transactions, setTransactions } = useDataStore();

  const [form, setForm] = useState<
    Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">
  >({
    amount: "0",
    note: "",
    type: "income",
    deductible: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;
    const res = await commitTransaction(user.id, {
      type: form.type,
      amount: Number(form.amount),
      note: form.note || "",
      deductible: form.deductible,
    });
    if (res.success) {
      onClose();
      toast.success("Transaction added successfully");
      if (res.data) {
        setTransactions([...transactions, res.data as Transaction]);
      }
    } else {
      toast.error(res.error?.message || "An error occurred");
    }
  };

  // Update the total revenue and total expenses and total profit and effective rate on submit

  return (
    <div className="absolute top-16 right-0 w-full max-w-2xl background-elevated border background-border rounded-lg p-4 flex items-center justify-center flex-col">
      <button onClick={onClose} className="absolute top-4 right-4 p-1">
        <X className="w-6 h-6 text-primary transition-all border background-border rounded-full hover:cursor-pointer hover:text-(--accent-red) hover:border-(--accent-red)" />
      </button>

      <form
        className="flex flex-col gap-2 md:gap-4 border-b-2 background-border pb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div>
          <label
            htmlFor="amount"
            className="text-lg font-semibold uppercase primary-slate"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            className="w-full p-2 border background-border rounded-lg focus:outline focus:outline-(--accent-cyan) text-primary"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor="note"
            className="text-lg font-semibold uppercase primary-slate"
          >
            Note
          </label>
          <input
            type="text"
            id="note"
            className="w-full p-2 border background-border rounded-lg focus:outline focus:outline-(--accent-cyan) text-primary"
            value={form.note || ""}
            onChange={(e) => setForm({ ...form, note: e.target.value || null })}
          />
        </div>
        <div>
          <label
            htmlFor="type"
            className="text-lg font-semibold uppercase primary-slate"
          >
            Type
          </label>
          <select
            id="type"
            className="w-full p-2 border background-border rounded-lg focus:outline focus:outline-(--accent-cyan) text-primary"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as "income" | "expense" })
            }
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="deductible"
            className="text-lg font-semibold uppercase primary-slate"
          >
            Deductible
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
          className="w-full p-2 border background-border rounded-lg focus:outline focus:outline-(--accent-cyan) text-primary primary-slate hover:text-primary uppercase font-semibold"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}
