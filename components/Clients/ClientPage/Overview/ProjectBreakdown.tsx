// | Project | Revenue | Expenses | Profit | Margin |
const tableLists = ["Project", "Revenue", "Expenses", "Profit", "Margin"];

const projectBreakdown = [
  {
    project: "Project 1",
    revenue: 1000,
    expenses: 500,
    profit: 500,
    margin: 50,
  },
  {
    project: "Project 2",
    revenue: 2000,
    expenses: 1000,
    profit: 1000,
    margin: 20,
  },
  {
    project: "Project 3",
    revenue: 3000,
    expenses: 1500,
    profit: 1500,
    margin: 30,
  },
];

export default function ProjectBreakdown() {
  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <h1 className="text-base text-secondary uppercase font-semibold">
        Project Breakdown
      </h1>
      <table className="w-full">
        <thead className="border-b-2 background-border">
          <tr>
            {tableLists.map((list) => (
              <th
                key={list}
                className="text-sm font-semibold text-secondary text-center pb-2"
              >
                {list}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projectBreakdown.map((project) => (
            <tr
              key={project.project}
              className="border-b border-[#21262d] text-center text-secondary"
            >
              <td className="text-sm text-primary py-2">{project.project}</td>
              <td className="primary-green">${project.revenue}</td>
              <td className="primary-red">${project.expenses}</td>
              <td className="primary-green">${project.profit}</td>
              <td
                className={`${project.margin >= 40 ? "primary-green" : project.margin >= 25 ? "primary-slate" : "primary-red"}`}
              >
                {project.margin}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-secondary">
        Revenue and profit by project under this client.
      </p>
    </div>
  );
}
