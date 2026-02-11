"use client";

import ExpensesForm from "@/components/Finances/Expense/ExpensesForm";
import IncomeForm from "@/components/Finances/Income/IncomeForm";
import { useAuth } from "@/lib/useAuth";
import Link from "next/link";
// track income and expenses
// calculate taxes
// generate "Safe to spend" amount

import { useState } from "react";

export default function FinancesPage() {
  const { user, loading } = useAuth();

  const [showIncomeForm, setShowIncomeForm] = useState<boolean>(false);
  const [showExpenseForm, setShowExpenseForm] = useState<boolean>(false);

  if (loading)
    return (
      <div className="text-center text-white font-semibold">Loading...</div>
    );
  if (!user)
    return (
      <div className="text-center text-white font-semibold">
        You must be logged in to access this page
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-[#2dd4bf] hover:text-[#2dd4bf]/60 transition-all underline"
          >
            Login
          </Link>
          <span className="text-gray-400">or</span>
          <Link
            href="/register"
            className="text-[#2dd4bf] hover:text-[#2dd4bf]/60 transition-all underline"
          >
            Register
          </Link>
        </div>
      </div>
    );

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col gap-2 items-center w-full">
        <h1
          onClick={() => setShowIncomeForm(!showIncomeForm)}
          className={`text-sm font-semibold uppercase transition-all duration-300 cursor-pointer ${showIncomeForm ? "text-[#14b8a6]" : "text-white hover:text-[#14b8a6]"}`}
        >
          Add Income
        </h1>
        <div className="w-full border-b-2 border-[#1f2937] pb-2">
          {showIncomeForm ? (
            <IncomeForm setShowIncomeForm={setShowIncomeForm} />
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center w-full">
        <h1
          onClick={() => setShowExpenseForm(!showExpenseForm)}
          className={`text-sm font-semibold uppercase transition-all duration-300 cursor-pointer ${showExpenseForm ? "text-[#14b8a6]" : "text-white hover:text-[#14b8a6]"}`}
        >
          Add Expense
        </h1>
        <div className="w-full border-b-2 border-[#1f2937] pb-2">
          {showExpenseForm ? <ExpensesForm /> : null}
        </div>
      </div>
      <section>
        <h1>Taxes</h1>
      </section>
    </div>
  );
}
