import { fetchIncomes } from "@/actions/finance/fetchIncomes";
import { useAuth } from "@/lib/useAuth";
import { Transaction } from "@/types/types";
import { useEffect, useState } from "react";
import IncomeForm from "./IncomeForm";

export default function Income() {
  const { user } = useAuth();

  console.log("User", user);

  const [incomes, setIncomes] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await fetchIncomes(user.id);

      console.log("Data:", res.data);
      if (!res.success) {
        console.log("Error:", res.error);
        return;
      }

      setIncomes(res.data as Transaction[]);
    })();
  }, [user]);

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="flex flex-col gap-2 items-center w-full">
        <h1
          className={`text-sm font-semibold uppercase transition-all duration-300`}
        >
          New Income
        </h1>
        <div className="w-full border-b-2 border-[#1f2937] pb-2">
          <IncomeForm />
        </div>
      </div>
      {incomes.map((income) => (
        <div key={income.id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">{income.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">
              {income.amount}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
}
