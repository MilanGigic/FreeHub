"use client";

import { insertFinance } from "@/actions/finance/insertFinance";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/lib/useAuth";
import { Category } from "@/types/types";
import { FormEvent, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function IncomeForm() {
  const { user } = useAuth();

  const [incomeFormTitle, setIncomeFormTitle] = useState<string | null>(null);
  const [incomeFormDescription, setIncomeFormDescription] = useState<
    string | null
  >(null);

  const [incomeFormAmount, setIncomeFormAmount] = useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const debouncedFormTitle = useDebounce(incomeFormTitle, 300);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const data = await fetch(
        `/api/query-income?q=${debouncedFormTitle}&userId=${user.id}`,
      ).then((res) => res.json());

      if (data.length === 0) return;

      setCategories(data as Category[]);
    })();
  }, [debouncedFormTitle, user]);

  const handleAddIncome = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    if (!selectedCategory || !incomeFormAmount) return;

    const income = {
      userId: user.id,
      title: selectedCategory.name,
      amount: incomeFormAmount,
      description: incomeFormDescription,
      type: "income" as "income" | "expense",
      categoryId: selectedCategory?.id || null,
    };

    console.log("Income:", income);

    const result = await insertFinance({ ...income });
    if (result.data) {
      if (result.success) {
        setIncomeFormTitle(null);
        setIncomeFormDescription(null);
        setIncomeFormAmount(null);
        setSelectedCategory(null);
        toast.success("Income added successfully");
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => handleAddIncome(e)}>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Income Title"
            className="rounded-lg background-elevated text-primary text-center border background-border px-4 py-2 outline-none focus-border-accent transition-all w-full placeholder:text-tertiary"
            value={
              selectedCategory
                ? selectedCategory.name
                : incomeFormTitle
                  ? incomeFormTitle
                  : ""
            }
            onChange={(e) => setIncomeFormTitle(e.target.value)}
          />

          {debouncedFormTitle && debouncedFormTitle.length > 2 && (
            <div>
              {categories.length > 0 ? (
                <div className="absolute top-12 w-full p-2 rounded-lg background-elevated border background-border flex flex-col gap-2 h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-center gap-2 cursor-pointer hover:bg-[var(--border-default)] rounded-lg p-2"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIncomeFormTitle(null);
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: category.color
                            ? category.color
                            : "var(--text-primary)",
                        }}
                      ></div>
                      <h2 className="text-sm font-semibold text-primary">
                        {category.name}
                      </h2>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="absolute top-12 w-full p-2 rounded-lg background-elevated border background-border flex items-center justify-center text-primary">
                  <p>Other...</p>
                </div>
              )}
            </div>
          )}
        </div>
        <textarea
          placeholder="Enter Income Description"
          className="rounded-lg background-elevated text-primary text-center border background-border px-4 py-2 outline-none resize-none text-xs focus-border-accent transition-all placeholder:text-tertiary"
          value={incomeFormDescription ? incomeFormDescription : ""}
          onChange={(e) => setIncomeFormDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Income Amount"
          className="rounded-lg background-elevated text-primary text-center border background-border px-4 py-2 outline-none font-mono focus-border-accent transition-all placeholder:text-tertiary"
          value={incomeFormAmount ? incomeFormAmount : ""}
          onChange={(e) => setIncomeFormAmount(Number(e.target.value))}
        />
      </div>
      <div>
        <button
          type="submit"
          className="rounded-lg background-elevated border w-full px-4 py-2 outline-none border-[var(--accent-green)] transition-all cursor-pointer text-primary font-semibold hover:bg-[var(--accent-green)]/20"
        >
          Add Income
        </button>
        <ToastContainer />
      </div>
    </form>
  );
}
