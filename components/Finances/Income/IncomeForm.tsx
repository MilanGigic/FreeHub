import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { insertFinance } from "@/actions/finance/insertFinance";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/lib/useAuth";
import { Category } from "@/types/types";
import { FormEvent, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function IncomeForm({
  setShowIncomeForm,
}: {
  setShowIncomeForm: (show: boolean) => void;
}) {
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
      const user = await getCurrentUser();
      if (!user) return;
      const data = await fetch(
        `/api/query-income?q=${debouncedFormTitle}&userId=${user.id}`,
      ).then((res) => res.json());

      if (data.length === 0) return;

      setCategories(data as Category[]);
    })();
  }, [debouncedFormTitle]);

  const handleAddIncome = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    console.log("User:", user);

    console.log("Income form title:", incomeFormTitle);
    console.log("Income form amount:", incomeFormAmount);
    console.log("Income form description:", incomeFormDescription);
    console.log("Income form category:", selectedCategory);
    console.log("Income form type:", "income");
    console.log("Income form category id:", selectedCategory?.id || null);

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
        console.log(">>>>success", result.data);
        toast.success("Income added successfully");
      } else {
        toast.error(result.error);
        console.log(">>>>error", result.error);
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
            className="rounded-lg bg-[#11151c] text-center border border-[#1f2937] px-4 py-2 outline-none focus:border-[#14b8a6] transition-all w-full"
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
                <div className="absolute top-12 w-full p-2 rounded-lg bg-[#0f131a] border border-[#1f2937] flex flex-col gap-2  h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-center gap-2 cursor-pointer hover:bg-[#1f2937] rounded-lg p-2"
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
          placeholder="Enter Income Description"
          className="rounded-lg bg-[#11151c] text-center border border-[#1f2937] px-4 py-2 outline-none resize-none text-xs focus:border-[#14b8a6] transition-all"
          value={incomeFormDescription ? incomeFormDescription : ""}
          onChange={(e) => setIncomeFormDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Income Amount"
          className="rounded-lg bg-[#11151c] text-center border border-[#1f2937] px-4 py-2 outline-none font-mono focus:border-[#14b8a6] transition-all"
          value={incomeFormAmount ? incomeFormAmount : ""}
          onChange={(e) => setIncomeFormAmount(Number(e.target.value))}
        />
      </div>
      <div className="flex justify-between">
        <div>
          <button
            type="submit"
            className="rounded-lg bg-[#11151c] border  px-4 py-2 outline-none border-[#34d399] transition-all cursor-pointer text-white  font-semibold hover:bg-[#34d399]/40"
          >
            Add Income
          </button>
          <ToastContainer />
        </div>
        <button
          type="button"
          onClick={() => setShowIncomeForm(false)}
          className="rounded-lg bg-[#11151c] border  px-4 py-2 outline-none border-[#ef4444] transition-all cursor-pointer text-white  font-semibold hover:bg-[#ef4444]/40"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
