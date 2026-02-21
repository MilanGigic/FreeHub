import { ChevronDown, Pen } from "lucide-react";
import { useState } from "react";

const tableLists = ["Client", "Revenue", "Expenses", "Taxes", "Profit"];

const tableData = [
  {
    client: "Client 1",
    revenue: 1000,
    expenses: 500,
    taxes: 100,
    profit: 400,
  },
  {
    client: "Client 2",
    revenue: 2500,
    expenses: 1200,
    taxes: 350,
    profit: 950,
  },
  {
    client: "Client 3",
    revenue: 1800,
    expenses: 900,
    taxes: 200,
    profit: 700,
  },
  {
    client: "Client 4",
    revenue: 3200,
    expenses: 2100,
    taxes: 400,
    profit: 700,
  },
];

export default function ProjectProfitability() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center border background-border rounded-lg background-elevated p-4">
      <header className="flex w-full justify-between items-center">
        <h1 className="text-lg font-semibold text-secondary uppercase">
          Project Profitability
        </h1>
        <div className="relative">
          <button
            onClick={() => setOpenDropdown((prev) => !prev)}
            className={`flex items-center gap-2 text-secondary text-sm font-semibold background-elevated py-2 px-4 rounded-lg border transition-all ${openDropdown ? "border-[var(--accent-cyan)]" : "background-border"}`}
          >
            All Projects <ChevronDown className="w-4 h-4 text-secondary" />
          </button>
          {openDropdown ? (
            <div className="flex flex-col gap-2 absolute mt-1 w-full h-full bg-black/50">
              <div className="flex flex-col items-center gap-2 background-elevated p-2 rounded-lg border background-border">
                <h1 className="text-sm font-semibold text-secondary py-2 px-4 hover:bg-[var(--border-default)] transition-all cursor-pointer w-full text-center rounded-lg">
                  Project 1
                </h1>
                <h1 className="text-sm font-semibold text-secondary py-2 px-4 hover:bg-[var(--border-default)] transition-all cursor-pointer w-full text-center rounded-lg">
                  Project 2
                </h1>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <section className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2 w-full justify-between border-b-2 background-border pb-2">
          {tableLists.map((list) => (
            <h1
              key={list}
              className="text-sm font-semibold text-secondary text-center w-full"
            >
              {list}
            </h1>
          ))}
        </div>
        <div>
          {tableData.map((data) => (
            <div key={data.client}>
              <div className="flex items-center gap-2 w-full justify-between border-b background-border py-2">
                <h1 className="text-sm text-primary text-center w-full">
                  {data.client}
                </h1>
                <h1 className="text-sm text-secondary text-center w-full">
                  $
                  <span className="primary-green ml-0.5">
                    {data.revenue.toLocaleString()}
                  </span>
                </h1>
                <h1 className="text-sm text-secondary text-center w-full">
                  $
                  <span className="primary-red ml-0.5">
                    {data.expenses.toLocaleString()}
                  </span>
                </h1>
                <h1 className="text-sm text-secondary text-center w-full">
                  $
                  <span className="primary-amber ml-0.5">
                    {data.taxes.toLocaleString()}
                  </span>
                </h1>
                <h1 className="text-sm text-secondary text-center w-full font-semibold">
                  $
                  {data.profit >= 0 ? (
                    <span className="primary-green ml-0.5">
                      {data.profit.toLocaleString()}
                    </span>
                  ) : (
                    <span className="primary-red">
                      -${Math.abs(data.profit).toLocaleString()}
                    </span>
                  )}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="flex w-full">
        <button className="font-semibold text-sm flex items-center text-secondary gap-2 hover:underline transition-all cursor-pointer">
          <Pen className="w-4 h-4" /> Add New Project
        </button>
      </footer>
    </div>
  );
}
