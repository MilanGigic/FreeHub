import { insertExpense } from "@/actions/finance/insertExpense";
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

    const result = await insertExpense({ ...expense });
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
            className="rounded-lg bg-[#11151c] text-center border border-[#1f2937] px-4 py-2 outline-none focus:border-[#14b8a6] transition-all w-full"
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
                <div className="absolute top-12 w-full p-2 rounded-lg bg-[#0f131a] border border-[#1f2937] flex flex-col gap-2  h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-center gap-2 cursor-pointer hover:bg-[#1f2937] rounded-lg p-2"
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
                            : "#000000",
                        }}
                      ></div>
                      <h2 className="text-sm font-semibold text-white">
                        {category.name}
                      </h2>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="absolute top-12 w-full p-2 rounded-lg bg-[#0f131a] border border-[#1f2937] flex items-center justify-center">
                  <p>Other...</p>
                </div>
              )}
            </div>
          )}
        </div>
        <textarea
          placeholder="Enter Expense Description"
          className="rounded-lg bg-[#11151c] text-center border border-[#1f2937] px-4 py-2 outline-none resize-none text-xs focus:border-[#14b8a6] transition-all"
          value={expenseFormDescription ? expenseFormDescription : ""}
          onChange={(e) => setExpenseFormDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Expense Amount"
          className="rounded-lg bg-[#11151c] text-center border border-[#1f2937] px-4 py-2 outline-none font-mono focus:border-[#14b8a6] transition-all"
          value={expenseFormAmount ? expenseFormAmount : ""}
          onChange={(e) => setExpenseFormAmount(Number(e.target.value))}
        />
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="rounded-lg bg-[#11151c] border  px-4 py-2 outline-none border-[#34d399] transition-all cursor-pointer text-white  font-semibold hover:bg-[#34d399]/40"
        >
          Add Expense
        </button>
        <button
          type="button"
          className="rounded-lg bg-[#11151c] border  px-4 py-2 outline-none border-[#ef4444] transition-all cursor-pointer text-white  font-semibold hover:bg-[#ef4444]/40"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
