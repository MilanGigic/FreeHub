"use client";

import { useDataStore } from "@/lib/store/useDataStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useAuth } from "@/lib/useAuth";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const projectListHeaderKeys = [
  "projectName",
  "description",
  "revenue",
  "expensesColumn",
  "profit",
  "hoursWorked",
] as const;

export default function ProjectsCard() {
  const router = useRouter();
  const t = useTranslations("dashboard");

  const { user } = useAuth();
  const { activeProjects, setSelectedProject } = useProjectStore();
  const { projects } = useDataStore();

  if (!user)
    return (
      <div className="border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full text-xl font-bold uppercase text-center">
        {t("loginToViewProjects")}
      </div>
    );

  return (
    <div className="flex flex-col justify-between items-center gap-2 w-full h-full">
      <main className="flex flex-col gap-4 sm:gap-8 w-full">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <p className="text-sm text-slate-400 flex flex-col">
            {t("totalProjects")}{" "}
            <span className="font-bold text-primary text-lg sm:text-xl">
              {projects.length}
            </span>
          </p>
          <p className="text-sm text-slate-400 flex flex-col">
            {t("activeProjects")}{" "}
            <span className="font-bold text-primary text-lg sm:text-xl">
              {activeProjects.length}
            </span>
          </p>
        </div>

        {activeProjects.length > 0 && (
          <div className="w-full overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[720px] table-fixed">
              <thead className="border-b-2 background-border">
                <tr>
                  {projectListHeaderKeys.map((key) => (
                    <th
                      key={key}
                      className={`text-xs sm:text-sm font-semibold text-slate-400 pb-2 px-2 first:pl-0 ${key === "projectName" || key === "description" ? "text-start" : "text-end"}`}
                    >
                      {t(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b-[0.5px] background-border text-start cursor-pointer hover:bg-(--bg-elevated) transition-all duration-300 ease-out"
                    onClick={() => {
                      router.push(`/projects/${project.id}`);
                      setSelectedProject(project);
                    }}
                  >
                    <td className="text-sm font-semibold text-primary py-3 sm:py-4 pr-2">
                      {project.name}
                    </td>
                    <td className="primary-slate text-sm text-slate-400 px-2 truncate">
                      {project.description}
                    </td>
                    <td
                      className={`${Number(project.totalRevenue) === 0 ? "text-slate-400" : "text-primary"} text-end px-2`}
                    >
                      {project.totalRevenue} RSD
                    </td>
                    <td
                      className={`${Number(project.totalExpenses) === 0 ? "text-slate-400" : "primary-red"} text-end px-2`}
                    >
                      {project.totalExpenses} RSD
                    </td>
                    <td
                      className={`${Number(project.totalProfit) === 0 ? "text-slate-400" : "primary-green"} text-end px-2`}
                    >
                      {project.totalProfit} RSD
                    </td>
                    <td
                      className={`${Number(project.totalHoursWorked) === 0 ? "text-slate-400" : "primary-purple"} text-end px-2`}
                    >
                      {project.totalHoursWorked}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
