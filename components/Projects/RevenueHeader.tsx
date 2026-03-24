import { useProjectStore } from "@/lib/store/useProjectStore";

export default function RevenueHeader() {
  const { selectedProject } = useProjectStore();

  if (!selectedProject) return null;

  return (
    <header className="w-full text-center flex gap-2">
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          ${Number(selectedProject.totalRevenue || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </p>
        <h1 className="primary-slate tracking-widest">Total Revenue:</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          ${Number(selectedProject.totalExpenses || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </p>
        <h1 className="primary-slate tracking-widest">Total Expenses:</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          ${Number(selectedProject.totalProfit || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </p>
        <h1 className="primary-slate tracking-widest">Net Profit:</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          $
          {Number(selectedProject.totalProfit) &&
          Number(selectedProject.totalHoursWorked)
            ? (
                Number(selectedProject.totalProfit) /
                Number(selectedProject.totalHoursWorked)
              ).toFixed(2)
            : "0.00"}
        </p>
        <h1 className="primary-slate tracking-widest">Effective Rate:</h1>
      </div>
    </header>
  );
}
