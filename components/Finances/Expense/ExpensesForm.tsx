import { insertFinance } from "@/actions/finance/insertFinance";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/lib/useAuth";
import { Category } from "@/types/types";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ExpensesForm() {
  const { user } = useAuth();

  const [expenseFormTitle, setExpenseFormTitle] = useState<string | null>(null);
  const [expenseFormDescription, setExpenseFormDescription] = useState<
    string | null
  >(null);
  const [expenseFormAmount, setExpenseFormAmount] = useState<number | null>(
    null,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const debouncedFormTitle = useDebounce(expenseFormTitle, 300);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const data = await fetch(
        `/api/query-expense?q=${debouncedFormTitle}&userId=${user.id}`,
      ).then((res) => res.json());

      if (data.length === 0) return;

      setCategories(data as Category[]);
    })();
  }, [debouncedFormTitle, user]);

  const handleAddExpense = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    if (!selectedCategory || !expenseFormAmount) return;

    const expense = {
      userId: user.id,
      title: selectedCategory.name,
      amount: expenseFormAmount,
      description: expenseFormDescription,
      type: "expense" as "income" | "expense",
      categoryId: selectedCategory?.id || null,
    };

    console.log("Expense:", expense);

    const result = await insertFinance({ ...expense });
    if (result.data) {
      if (result.success) {
        setExpenseFormTitle(null);
        setExpenseFormDescription(null);
        setExpenseFormAmount(null);
        setSelectedCategory(null);
        toast.success("Expense added successfully");
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => handleAddExpense(e)}>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Expense Title"
            className="rounded-lg background-elevated text-primary text-center border background-border px-4 py-2 outline-none focus-border-accent transition-all w-full placeholder:text-tertiary"
            value={
              selectedCategory
                ? selectedCategory.name
                : expenseFormTitle
                  ? expenseFormTitle
                  : ""
            }
            onChange={(e) => setExpenseFormTitle(e.target.value)}
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
                        setExpenseFormTitle(null);
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
          placeholder="Enter Expense Description"
          className="rounded-lg background-elevated text-primary text-center border background-border px-4 py-2 outline-none resize-none text-xs focus-border-accent transition-all placeholder:text-tertiary"
          value={expenseFormDescription ? expenseFormDescription : ""}
          onChange={(e) => setExpenseFormDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Expense Amount"
          className="rounded-lg background-elevated text-primary text-center border background-border px-4 py-2 outline-none font-mono focus-border-accent transition-all placeholder:text-tertiary"
          value={expenseFormAmount ? expenseFormAmount : ""}
          onChange={(e) => setExpenseFormAmount(Number(e.target.value))}
        />
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="rounded-lg background-elevated border border-[var(--accent-green)] px-4 py-2 outline-none transition-all cursor-pointer text-primary font-semibold hover:bg-[var(--accent-green)]/20"
        >
          Add Expense
        </button>
        <button
          type="button"
          className="rounded-lg background-elevated border border-[var(--accent-red)] px-4 py-2 outline-none transition-all cursor-pointer text-primary font-semibold hover:bg-[var(--accent-red)]/20"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
