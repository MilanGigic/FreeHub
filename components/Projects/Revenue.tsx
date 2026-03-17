"use client";

import RevenueHeader from "./RevenueHeader";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Transaction } from "@/types/types";
import { useAuth } from "@/lib/useAuth";
import { fetchRecentTransactions } from "@/actions/finances/fetchRecentTransactions";
import { toast } from "react-toastify";
import AddTransactionModal from "./AddTransactionModal";
import { useDataStore } from "@/lib/store/useDataStore";

const filteredTransactions = (
  transactions: Transaction[],
  type: "all" | "income" | "expense",
) => {
  if (type === "all") return transactions;
  return transactions.filter((transaction) => transaction.type === type);
};

export default function Revenue() {
  const { user } = useAuth();

  const { transactions, setTransactions } = useDataStore();
  const [transactionType, setTransactionType] = useState<
    "all" | "income" | "expense"
  >("all");

  const [openAddTransactionModal, setOpenAddTransactionModal] =
    useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await fetchRecentTransactions(user.id);
      if (res.success) {
        if (res.data) {
          setTransactions(res.data);
        }
      } else {
        toast.error(res.error?.message || "An error occurred");
      }
    })();
  }, [user, setTransactions]);

  return (
    <div className="w-full flex flex-col gap-2 md:gap-4 h-full justify-between background-elevated border background-border rounded-lg p-4">
      <RevenueHeader />

      <div className="w-full flex gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 justify-between relative">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTransactionType("all")}
            className={`primary-slate hover:text-primary px-4 rounded-lg border background-border py-2 hover:bg-(--accent-cyan)/20 cursor-pointer transition-all duration-300 ease-out ${transactionType === "all" ? "border-(--accent-cyan) bg-(--accent-cyan)/10 text-primary" : "background-border primary-slate hover:border-(--accent-cyan)"}`}
          >
            All
          </button>
          <button
            onClick={() => setTransactionType("income")}
            className={`primary-slate hover:text-primary px-4 rounded-lg border background-border py-2 hover:bg-(--accent-green)/20 cursor-pointer transition-all duration-300 ease-out ${transactionType === "income" ? "border-(--accent-green) bg-(--accent-green)/10 text-primary" : "background-border primary-slate hover:border-(--accent-green)"}`}
          >
            Income
          </button>
          <button
            onClick={() => setTransactionType("expense")}
            className={`primary-slate hover:text-primary px-4 rounded-lg border background-border py-2 hover:bg-(--accent-red)/20 cursor-pointer transition-all duration-300 ease-out ${transactionType === "expense" ? "border-(--accent-red) bg-(--accent-red)/10 text-primary" : "background-border primary-slate hover:border-(--accent-red)"}`}
          >
            Expenses
          </button>
        </div>
        <button
          onClick={() => setOpenAddTransactionModal(true)}
          className="primary-slate hover:text-primary uppercase font-semibold bg-(--accent-green)/80 hover:bg-(--accent-green)/40 px-4 py-2 rounded-lg border background-border cursor-pointer transition-all duration-300 ease-out flex items-center gap-2"
        >
          <PlusIcon size={20} /> Add Transaction
        </button>

        {openAddTransactionModal && (
          <AddTransactionModal
            onClose={() => setOpenAddTransactionModal(false)}
          />
        )}
      </div>

      <div className="w-full h-full border background-border rounded-lg p-4 background-elevated">
        <table className="w-full flex flex-col gap-2">
          <thead className="border-b background-border pb-4">
            <tr className="flex w-full justify-between">
              <th className="text-primary text-center w-full">Description</th>
              <th className="text-primary text-center w-full">Date</th>
              <th className="text-primary text-center w-full">Type</th>
              <th className="text-primary text-center w-full">Amount</th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-2">
            {filteredTransactions(transactions, transactionType).map(
              (transaction) => (
                <tr
                  key={transaction.id}
                  className="flex w-full justify-between border-b-2 background-border pb-2"
                >
                  <td className="text-primary text-center w-full">
                    {transaction.note}
                  </td>
                  <td className="text-primary text-center w-full">
                    {transaction.createdAt.toLocaleDateString()}
                  </td>
                  <td className="text-primary text-center w-full">
                    {transaction.type}
                  </td>
                  <td className="text-primary text-center w-full">
                    {transaction.amount}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <footer>
        {transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-primary text-center">No transactions found</p>
          </div>
        )}
        {transactions.length > 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-primary text-center">
              {transactions.length}{" "}
              {transactions.length === 1 ? "transaction" : "transactions"}.
            </p>
          </div>
        )}
      </footer>
    </div>
  );
}
