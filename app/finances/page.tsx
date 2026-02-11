"use client";

// track income and expenses
// calculate taxes
// generate "Safe to spend" amount

import { useState } from "react";

export default function FinancesPage() {
  const [showIncomeForm, setShowIncomeForm] = useState<boolean>(false);
  const [incomeFormTitle, setIncomeFormTitle] = useState<string | null>(null);
  const [incomeFormAmount, setIncomeFormAmount] = useState<number | null>(null);

  const [incomeTitles, setIncomeTitles] = useState<string[]>([]);
  const [incomeAmounts, setIncomeAmounts] = useState<number[]>([]);

  const handleAddIncome = () => {
    if (!incomeFormTitle || !incomeFormAmount) return;

    setIncomeTitles((prev) => [...prev, incomeFormTitle]);
    setIncomeAmounts((prev) => [...prev, incomeFormAmount]);
    setIncomeFormTitle(null);
    setIncomeFormAmount(null);
    setShowIncomeForm(false);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col items-center border-b-2 border-[#1f2937] pb-2">
        <h1
          onClick={() => setShowIncomeForm(!showIncomeForm)}
          className="text-sm font-semibold uppercase text-white hover:text-gray-300 transition-all duration-300 cursor-pointer"
        >
          Add Income
        </h1>
        <div>
          {showIncomeForm ? (
            <form>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Enter Income Title"
                  className="rounded-lg bg-[#11151c] text-center border border-[#1f2937] px-4 py-2 outline-none"
                  value={incomeFormTitle ? incomeFormTitle : ""}
                  onChange={(e) => setIncomeFormTitle(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Enter Income Amount"
                  className="rounded-lg bg-[#11151c] text-center border border-[#1f2937] px-4 py-2 outline-none font-mono"
                  value={incomeFormAmount ? incomeFormAmount : ""}
                  onChange={(e) => setIncomeFormAmount(Number(e.target.value))}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="rounded-lg bg-[#11151c] border border-[#1f2937] px-4 py-2 outline-none"
                >
                  Add Income
                </button>
                <button
                  type="button"
                  onClick={() => setShowIncomeForm(false)}
                  className="rounded-lg bg-[#11151c] border border-[#1f2937] px-4 py-2 outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
      <section>
        <h1>Expenses</h1>
      </section>
      <section>
        <h1>Taxes</h1>
      </section>
    </div>
  );
}
