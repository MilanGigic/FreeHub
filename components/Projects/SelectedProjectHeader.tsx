"use client";

import { useProjectStore } from "@/lib/store/useProjectStore";
import { differenceInDays } from "date-fns";

export default function SelectedProjectHeader() {
  const { selectedProject } = useProjectStore();

  if (!selectedProject) return null;

  const activeDays = differenceInDays(
    new Date(),
    new Date(selectedProject.createdAt),
  );

  return (
    <header className="w-full text-center flex gap-2">
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          {selectedProject.totalHoursWorked ?? 0}
        </p>
        <h1 className="primary-slate tracking-widest">Total Hours:</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          {activeDays}
        </p>
        <h1 className="primary-slate tracking-widest">Active Days:</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          ${Number(selectedProject.totalRevenue || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </p>
        <h1 className="primary-slate tracking-widest">Total Revenue:</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          ${Number(selectedProject.totalExpenses || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </p>
        <h1 className="primary-slate tracking-widest">Total Expenses:</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          ${Number(selectedProject.totalProfit || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </p>
        <h1 className="primary-slate tracking-widest">Total Profit:</h1>
      </div>
    </header>
  );
}
