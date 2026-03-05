import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const transactionTypes = ["Income", "Expense"];
const transactionTableLabels = ["Title", "Type", "Amount"];
const transactionTableData = [
  {
    title: "Client Invoice #1",
    type: "Income",
    amount: 100,
  },
  {
    title: "Rent",
    type: "Expense",
    amount: 100,
  },
  {
    title: "Subscription",
    type: "Recurring",
    amount: 100,
  },
  {
    title: "Food",
    type: "Expense",
    amount: 100,
  },
  {
    title: "Transport",
    type: "Expense",
    amount: 100,
  },
];

export default function TransactionSimulator() {
  const [transactionType, setTransactionType] = useState<string>("");

  return (
    <div className="background-elevated border background-border rounded-lg p-4 w-full">
      <header className="flex flex-col gap-2 md:gap-4 w-full pb-4">
        <div className="flex md:flex-row flex-col items-center justify-between">
          <h1 className="primary-slate uppercase font-semibold text-lg">
            Transaction Simulator
          </h1>
          <div className="flex items-center gap-2 md:gap-4">
            {transactionTypes.map((type) => (
              <button
                key={type}
                className={`text-sm primary-slate background-elevated border rounded-lg p-2 transition-all cursor-pointer ${transactionType === type ? "border-(--accent-cyan)" : "background-border"}`}
                onClick={() => setTransactionType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="w-full flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <label htmlFor="transactionTitle" className="text-sm primary-slate">
              {transactionType === "Income" ? (
                <Plus className="w-4 h-4 primary-slate" />
              ) : (
                <Minus className="w-4 h-4 primary-slate" />
              )}
            </label>
            <input
              type="text"
              id="transactionTitle"
              className="w-full rounded-lg background-elevated border background-border px-4 py-2 outline-none text-primary focus-border-accent transition-all"
            />
          </div>
          {transactionType === "Income" ? (
            <div className="flex items-center gap-2 md:gap-4">
              <label
                htmlFor="transactionFrom"
                className="text-sm primary-slate"
              >
                from
              </label>
              <input
                type="text"
                id="transactionFrom"
                className="w-full rounded-lg background-elevated border background-border px-4 py-2 outline-none text-primary focus-border-accent transition-all"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <label htmlFor="transactionFor" className="text-sm primary-slate">
                for
              </label>
              <input
                type="text"
                id="transactionFor"
                className="w-full rounded-lg background-elevated border background-border px-4 py-2 outline-none text-primary focus-border-accent transition-all"
              />
            </div>
          )}
        </div>
        <button className="rounded-lg background-elevated border px-4 py-2 outline-none border-(--accent-green) transition-all cursor-pointer text-primary font-semibold hover:bg-(--accent-green)/20">
          Simulate
        </button>
      </header>

      <main>
        <div className="flex items-center gap-2 justify-center pb-2">
          <button className="rounded-lg background-elevated border px-4 py-2 outline-none background-border transition-all cursor-pointer font-semibold primary-slate hover:border-(--accent-green)">
            Income
          </button>
          <button className="rounded-lg background-elevated border px-4 py-2 outline-none background-border transition-all cursor-pointer font-semibold primary-slate hover:border-(--accent-red)">
            Expense
          </button>
          <button className="rounded-lg background-elevated border px-4 py-2 outline-none background-border transition-all cursor-pointer font-semibold primary-slate hover:border-(--accent-amber)">
            Recurring
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              {transactionTableLabels.map((label) => (
                <th key={label} className="text-sm primary-slate text-center">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactionTableData.map((data) => (
              <tr key={data.title} className="border-b background-border py-2">
                <td className="text-sm text-primary text-center py-2">
                  {data.title}
                </td>
                <td
                  className={`${data.type === "Income" ? "primary-green" : data.type === "Expense" ? "primary-red" : data.type === "Recurring" ? "primary-cyan" : "primary-amber"} text-sm text-center py-2`}
                >
                  {data.type}
                </td>
                <td className={`text-sm text-center primary-slate py-2`}>
                  $
                  <span
                    className={`ml-0.5 ${data.type === "Income" ? "primary-green" : data.type === "Expense" ? "primary-red" : data.type === "Recurring" ? "primary-cyan" : "primary-amber"}`}
                  >
                    {data.amount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
