import { useProjectStore } from "@/lib/store/useProjectStore";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useState } from "react";
import RenderCard from "./Revenue/RenderCard";
import useFetchIncomeData from "./hooks/useFetchIncomeData";
import useFetchExpenseData from "./hooks/useFetchExpenseData";
import useCalculateProfit from "./hooks/useCalculateProfit";
import useFetchInvoices from "./hooks/useFetchInvoices";

export default function Revenue() {
  const { user } = useAuth();
  const { selectedProject, profit } = useProjectStore();

  const [revenue, setRevenue] = useState<string>("0");
  const [expenses, setExpenses] = useState<string>("0");
  const [hourlyRate, setHourlyRate] = useState<string>("0");

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

  useFetchIncomeData();
  useFetchExpenseData();
  useCalculateProfit();
  useFetchInvoices();

  useEffect(() => {
    (async () => {
      if (!selectedProject) return;
      if (selectedProject.totalHoursWorked === null) return;

      const res = Number(profit) / Number(selectedProject.totalHoursWorked);
      setHourlyRate(res.toFixed(2));
    })();
  }, [profit, selectedProject]);

  return (
    <div className="w-full flex gap-2 md:gap-4 justify-between h-full">
      {cards.map((card) => (
        <RenderCard
          key={card.label}
          card={card}
          selectedProject={selectedProject}
          user={user}
          revenue={revenue}
          expenses={expenses}
          setRevenue={setRevenue}
          setExpenses={setExpenses}
        />
      ))}
      <div className="w-full flex flex-col gap-2 md:gap-4 h-full">
        <div className="w-full flex flex-col gap-2 md:gap-4 background-elevated border background-border rounded-lg p-4 items-center">
          <p className="text-lg primary-slate uppercase font-semibold">
            Profit:
          </p>
          <span className="primary-cyan text-2xl font-bold">${profit}</span>
        </div>

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
    </div>
  );
}
