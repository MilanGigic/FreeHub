import { List } from "lucide-react";
import { useState } from "react";

const transactionTypes = ["Income", "Expense", "Recurring", "Other"];

const transactionData = [
  {
    name: "Client Invoice #1",
    type: "Income",
    amount: 100,
    date: "2024-01-01",
  },
  {
    name: "Rent",
    type: "Expense",
    amount: 100,
    date: "2024-01-01",
  },
  {
    name: "Subscription",
    type: "Recurring",
    amount: 100,
    date: "2024-01-01",
  },
  {
    name: "Food",
    type: "Other",
    amount: 100,
    date: "2024-01-01",
  },
  {
    name: "Transport",
    type: "Other",
    amount: 100,
    date: "2024-01-01",
  },
  {
    name: "Entertainment",
    type: "Expense",
    amount: 100,
    date: "2024-01-01",
  },
  {
    name: "Entertainment",
    type: "Expense",
    amount: 100,
    date: "2024-01-01",
  },
  {
    name: "Entertainment",
    type: "Expense",
    amount: 100,
    date: "2024-01-01",
  },
  {
    name: "Entertainment",
    type: "Expense",
    amount: 100,
    date: "2024-01-01",
  },
];

export default function RecentTransactions() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  return (
    <div className="background-elevated border background-border rounded-lg p-4 w-full h-full flex flex-col">
      <header className="flex items-center justify-between w-full border-b background-border pb-4">
        <h1 className="text-secondary uppercase font-semibold text-lg">
          Recent Transactions
        </h1>

        <ul className="items-center gap-2 hidden md:flex">
          {transactionTypes.map((type) => (
            <li
              key={type}
              className="text-secondary text-sm font-semibold cursor-pointer background-elevated border background-border rounded-lg p-2"
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
                <h1
                  key={type}
                  className="text-secondary text-sm font-semibold p-2 hover:bg-[var(--border-default)] cursor-pointer hover:rounded-lg focus-border-accent transition-all"
                >
                  {type}
                </h1>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <main className="flex flex-col gap-2 max-h-[210px] overflow-y-auto">
        {transactionData.map((transaction, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b background-border py-2"
          >
            <h1 className="text-primary text-sm font-medium w-full text-center">
              {transaction.name}{" "}
              <span className="text-secondary text-xs font-semibold background-elevated border background-border rounded-lg p-1">
                {transaction.type}
              </span>
            </h1>
            <h1
              className={`text-sm font-semibold w-full text-center ${transaction.type === "Income" ? "primary-green" : transaction.type === "Expense" ? "primary-red" : transaction.type === "Recurring" ? "primary-cyan" : "primary-amber"}`}
            >
              ${transaction.amount}
            </h1>
            <h1 className="text-secondary text-sm font-semibold w-full text-center">
              {transaction.date}
            </h1>
          </div>
        ))}
      </main>
    </div>
  );
}
