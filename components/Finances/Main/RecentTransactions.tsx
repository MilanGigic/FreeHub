"use client";

import { fetchRecentTransactions } from "@/actions/finances/fetchRecentTransactions";
import { useAuth } from "@/lib/useAuth";
import { Transaction } from "@/types/types";
import { List } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const transactionTypes = ["All", "Income", "Expense"];

function filterTransactions(
  transactions: Transaction[],
  type: "all" | "income" | "expense",
): Transaction[] {
  if (type === "all") return transactions;
  return transactions.filter((transaction) => transaction.type === type);
}

export default function RecentTransactions() {
  const { user } = useAuth();

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [transactionType, setTransactionType] = useState<
    "all" | "income" | "expense"
  >("all");

  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await fetchRecentTransactions(user.id);
      if (res.success) {
        if (res.data) {
          setRecentTransactions(res.data);
        }
      } else {
        toast.error(res.error?.message || "An error occurred");
      }
    })();
  }, [user]);

  const filteredTransactions = useMemo(
    () => filterTransactions(recentTransactions, transactionType),
    [recentTransactions, transactionType],
  );

  return (
    <div className="background-elevated border background-border rounded-lg p-4 w-full h-full flex flex-col">
      <header className="flex flex-col gap-2 items-start justify-between w-full border-b background-border pb-4">
        <h1 className="text-lg font-semibold tracking-widest text-primary uppercase">
          Recent Transactions
        </h1>

        <ul className="items-center gap-2 hidden md:flex">
          {transactionTypes.map((type) => (
            <li
              key={type}
              className={`text-sm font-semibold cursor-pointer background-elevated border background-border rounded-lg p-2 ${transactionType === type.toLowerCase() ? "border-(--accent-cyan) bg-(--accent-cyan)/10 text-primary" : "background-border primary-slate hover:border-(--accent-cyan)"} transition-all`}
              onClick={() =>
                setTransactionType(
                  type === "All"
                    ? "all"
                    : type === "Income"
                      ? "income"
                      : "expense",
                )
              }
            >
              {type}
            </li>
          ))}
        </ul>
        <div className="relative md:hidden">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="md:hidden flex items-center gap-2 text-secondary text-sm font-semibold cursor-pointer background-elevated border background-border rounded-lg p-2"
          >
            <h1 className="text-secondary text-sm font-semibold">
              All Transactions
            </h1>
            <List className="w-4 h-4 text-secondary" />
          </button>
          {openDropdown ? (
            <div className="absolute mt-1 w-full rounded-lg background-elevated border background-border shadow-lg z-10">
              {transactionTypes.map((type) => (
                <button
                  key={type}
                  className="text-secondary text-sm font-semibold p-2 hover:bg-(--border-interactive) cursor-pointer hover:rounded-lg focus-border-accent transition-all"
                  onClick={() =>
                    setTransactionType(type as "all" | "income" | "expense")
                  }
                >
                  {type}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <main className="flex flex-col gap-2 max-h-[210px] overflow-y-auto">
        {filteredTransactions.map((transaction, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b background-border py-2"
          >
            <h1 className="text-primary text-sm font-medium w-full text-center">
              {transaction.note || "No note"}{" "}
              <span className="primary-slate text-xs font-semibold background-elevated border background-border rounded-lg p-1">
                {transaction.type === "income" ? "Income" : "Expense"}
              </span>
            </h1>
            <h1
              className={`text-sm font-semibold w-full text-center ${transaction.type === "income" ? "primary-green" : "primary-red"}`}
            >
              ${transaction.amount}
            </h1>
            <h1 className="text-primary text-sm font-semibold w-full text-center">
              {transaction.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h1>
          </div>
        ))}
      </main>
    </div>
  );
}
