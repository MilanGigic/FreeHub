"use client";

// track income and expenses
// calculate taxes
// generate "Safe to spend" amount

import { useState } from "react";

export default function FinancesPage() {
  const [showIncomeForm, setShowIncomeForm] = useState<boolean>(false);
  const [incomeFormTitle, setIncomeFormTitle] = useState<string | null>(null);
  const [incomeFormDescription, setIncomeFormDescription] = useState<
    string | null
  >(null);
  const [incomeFormAmount, setIncomeFormAmount] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col items-center border-b-2 border-[#1f2937] pb-2 w-full">
        <h1
          onClick={() => setShowIncomeForm(!showIncomeForm)}
          className="text-sm font-semibold uppercase text-white hover:text-gray-300 transition-all duration-300 cursor-pointer"
        >
          Add Income
        </h1>
        <div className="w-full">
          {showIncomeForm ? (
            <form className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Enter Income Title"
                  className="rounded-lg bg-[#11151c] text-center border border-[#1f2937] px-4 py-2 outline-none focus:border-[#2dd4bf] transition-all"
                  value={incomeFormTitle ? incomeFormTitle : ""}
                  onChange={(e) => setIncomeFormTitle(e.target.value)}
                />
                <textarea
                  placeholder="Enter Income Description"
                  className="rounded-lg bg-[#11151c] text-center border border-[#1f2937] px-4 py-2 outline-none resize-none text-xs focus:border-[#2dd4bf] transition-all"
                  value={incomeFormDescription ? incomeFormDescription : ""}
                  onChange={(e) => setIncomeFormDescription(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Enter Income Amount"
                  className="rounded-lg bg-[#11151c] text-center border border-[#1f2937] px-4 py-2 outline-none font-mono focus:border-[#2dd4bf] transition-all"
                  value={incomeFormAmount ? incomeFormAmount : ""}
                  onChange={(e) => setIncomeFormAmount(Number(e.target.value))}
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="rounded-lg bg-[#11151c] border  px-4 py-2 outline-none border-[#34d399] transition-all cursor-pointer text-white  font-semibold hover:bg-[#34d399]/40"
                >
                  Add Income
                </button>
                <button
                  type="button"
                  onClick={() => setShowIncomeForm(false)}
                  className="rounded-lg bg-[#11151c] border  px-4 py-2 outline-none border-[#ef4444] transition-all cursor-pointer text-white  font-semibold hover:bg-[#ef4444]/40"
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
