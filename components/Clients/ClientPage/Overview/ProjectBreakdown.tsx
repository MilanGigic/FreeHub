import { useClientStore } from "@/lib/store/useClientStore";

// | Project | Revenue | Expenses | Profit | Margin |
const tableLists = ["Project", "Revenue", "Expenses", "Profit", "Margin"];

export default function ProjectBreakdown() {
  const { clientProjects } = useClientStore();

  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <h1 className="text-base primary-slate uppercase font-semibold">
        Project Breakdown
      </h1>
      <table className="w-full">
        <thead className="border-b-2 background-border">
          <tr>
            {tableLists.map((list) => (
              <th
                key={list}
                className="text-sm font-semibold primary-slate text-center pb-2"
              >
                {list}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clientProjects.length === 0 && (
            <tr>
              <td colSpan={5} className="text-sm primary-slate text-center py-4">
                No projects for this client yet
              </td>
            </tr>
          )}
          {clientProjects.map((project) => (
            <tr
              key={project.id}
              className="border-b background-border text-center primary-slate"
            >
              <td className="text-sm text-primary py-2">{project.name}</td>
              <td className="primary-green">
                ${Number(project.totalRevenue || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="primary-red">
                ${Number(project.totalExpenses || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="primary-green">
                ${Number(project.totalProfit || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td
                className={`${project.totalMargin && Number(project.totalMargin) >= 40 ? "primary-green" : project.totalMargin && Number(project.totalMargin) >= 25 ? "primary-slate" : "primary-red"}`}
              >
                {project.totalMargin ? `${Number(project.totalMargin).toFixed(2)}%` : "0.00%"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm primary-slate">
        Revenue and profit by project under this client.
      </p>
    </div>
  );
}
