import { addExpense } from "@/actions/projects/revenue/addExpense";
import { addIncome } from "@/actions/projects/revenue/addIncome";
import { calculateProfit } from "@/actions/projects/revenue/calculateProfit";
import { fetchExpenseData } from "@/actions/projects/revenue/fetchExpenseData";
import { fetchIncomeData } from "@/actions/projects/revenue/fetchIncomeData";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { ProjectRevenue } from "@/types/types";
import { MouseEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Revenue() {
  const { selectedProject, profit, setProfit } = useProjectStore();

  const [revenue, setRevenue] = useState<string>("0");
  const [expenses, setExpenses] = useState<string>("0");
  const [hourlyRate, setHourlyRate] = useState<string>("0");

  const [revenueList, setRevenueList] = useState<ProjectRevenue[]>([]);
  const [expenseList, setExpenseList] = useState<ProjectRevenue[]>([]);

  const [revenueNote, setRevenueNote] = useState<string>("");
  const [expenseNote, setExpenseNote] = useState<string>("");

  const cards = [
    {
      label: "Revenue",
      value: revenue,
      onChange: (value: string) => setRevenue(value),
    },
    {
      label: "Expenses",
      value: expenses,
      onChange: (value: string) => setExpenses(value),
    },
  ];

  const selectedProjectId = selectedProject?.id;

  useEffect(() => {
    (async () => {
      if (!selectedProjectId) return;

      const res = await fetchIncomeData(selectedProjectId);
      const expenseRes = await fetchExpenseData(selectedProjectId);

      if (res.success) {
        if (res.data) {
          if (res.data.length > 0) {
            setRevenueList(res.data);
          }
        }
      } else {
        toast.error(res.error as string);
      }

      if (expenseRes.success) {
        if (expenseRes.data) {
          if (expenseRes.data.length > 0) {
            setExpenseList(expenseRes.data);
          }
        }
      } else {
        toast.error(expenseRes.error as string);
      }
    })();
  }, [selectedProjectId]);

  useEffect(() => {
    (async () => {
      if (!selectedProject) return;
      if (selectedProject.totalHoursWorked === null) return;

      const res = Number(profit) / Number(selectedProject.totalHoursWorked);
      setHourlyRate(res.toFixed(2));
    })();
  }, [profit, selectedProject]);

  const handleAddRevenue = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selectedProject) return;

    const result = await addIncome(selectedProject.id, revenue, revenueNote);

    if (result.success) {
      if (result.data) {
        setRevenueList([...revenueList, result.data]);
        console.log("Revenue list:", revenueList);
        setRevenue("0");
        setRevenueNote("");
        toast.success("Revenue added successfully");
      }
    }
  };

  const handleAddExpense = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selectedProject) return;

    const result = await addExpense(selectedProject.id, expenses, expenseNote);

    if (result.success) {
      if (result.data) {
        setExpenseList([...expenseList, result.data]);
        console.log("Expense list:", result.data);
        setExpenses("0");
        setExpenseNote("");
        toast.success("Expense added successfully");
      }
    } else {
      toast.error((result as { error: string }).error);
    }
  };
  function renderCard(card: {
    label: string;
    value: string;
    onChange: (value: string) => void;
  }) {
    return (
      <div
        key={card.label}
        className="flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 w-full"
      >
        <div className="flex flex-col gap-2 md:gap-4 border-b-2 background-border pb-4">
          <p className="text-lg primary-slate uppercase font-semibold">
            {card.label}:
            <span
              className={`${card.label === "Revenue" ? "primary-green" : card.label === "Expenses" ? "primary-red" : card.label === "Profit" ? "primary-cyan" : card.label === "Margin" ? "primary-amber" : "primary-purple"}`}
            >
              ${card.value}
            </span>
          </p>
          <div>
            <label htmlFor={card.label}>{card.label}</label>
            <input
              type="number"
              id={card.label}
              value={card.value}
              onChange={(e) => card.onChange(e.target.value)}
              className="w-full p-2 border background-border rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="note">Note:</label>

            <input
              type="text"
              id="note"
              value={card.label === "Revenue" ? revenueNote : expenseNote}
              onChange={(e) =>
                card.label === "Revenue"
                  ? setRevenueNote(e.target.value)
                  : setExpenseNote(e.target.value)
              }
              className="w-full p-2 border background-border rounded-lg"
            />
          </div>
          <button
            onClick={(e) =>
              card.label === "Revenue"
                ? handleAddRevenue(e)
                : card.label === "Expenses"
                  ? handleAddExpense(e)
                  : undefined
            }
            className={`p-2 w-full border rounded-lg cursor-pointer transition-all
              ${card.label === "Revenue" ? "border-(--accent-green) hover:bg-(--accent-green)/20" : card.label === "Expenses" ? "border-(--accent-red) hover:bg-(--accent-red)/20" : "border-(--accent-cyan) hover:bg-(--accent-cyan)/20"}
              `}
          >
            New <span className="capitalize">{card.label}</span>
          </button>
        </div>

        <div className="flex flex-col gap-2 md:gap-4">
          <h1 className="text-lg primary-slate uppercase font-semibold text-center">
            {card.label} History:
          </h1>
          {card.label === "Revenue" ? (
            <div>
              {revenueList.map((item) => (
                <div key={item.id}>
                  <p className="flex items-center gap-2">
                    ${String(item.amount)} -
                    <span className="primary-slate text-sm">{item.note}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : card.label === "Expenses" ? (
            <div>
              {expenseList.map((item) => (
                <div key={item.id}>
                  <p className="flex items-center gap-2">
                    ${String(item.amount)} -
                    <span className="primary-slate text-sm">{item.note}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  useEffect(() => {
    (async () => {
      if (!selectedProject) return;

      const res = await calculateProfit(
        selectedProject.id,
        revenueList,
        expenseList,
      );

      if (res.success) {
        if (res.data) {
          setProfit(String(res.data.totalProfit));
        }
      } else {
        toast.error(res.error as string);
      }
    })();
  }, [revenueList, expenseList, selectedProject]);

  // THE REVENUE AND EXPENSE HISTORIES DONT WORK - THEY SHOW BOTH REVENUE AND EXPENSES -- FIX IT
  // WORK ON HOURLY RATE CALCULATION

  return (
    <div className="w-full flex gap-2 md:gap-4 justify-between h-full">
      {cards.map((card) => renderCard(card))}
      <div className="w-full flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 items-center">
        <p className="text-lg primary-slate uppercase font-semibold">Profit:</p>
        <span className="primary-cyan text-2xl font-bold">${profit}</span>
      </div>

      {/* WORK ON HOURLY RATE CALCULATION */}
      <div className="w-full flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 items-center">
        <header className="flex flex-col gap-2 md:gap-4 items-center border-b-2 background-border pb-4 w-full">
          <p className="text-lg primary-slate uppercase font-semibold">
            Hourly Rate:
          </p>
          <span className="primary-purple text-2xl font-bold">
            ${hourlyRate}
          </span>
        </header>
        <div className="flex flex-col gap-2 md:gap-4 justify-start w-full">
          <h1 className="primary-slate uppercase font-semibold flex items-center gap-2">
            Total Hours Worked:
            <span className="primary-cyan text-lg font-bold">
              {" "}
              {selectedProject?.totalHoursWorked}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
