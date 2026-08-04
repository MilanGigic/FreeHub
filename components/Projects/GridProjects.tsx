"use client";

import { useProjectStore } from "@/lib/store/useProjectStore";
import { Project } from "@/types/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

function MarginBar({ value }: { value: number }) {
  const clampedValue = Math.min(100, Math.max(0, value));
  return (
    <div className="flex items-center gap-2 min-w-0 w-full">
      <div className="flex-1 min-w-0 h-3 sm:h-4 bg-[#27272a] rounded-md overflow-hidden">
        <div
          className="h-full bg-[#2dd4bf] rounded-md transition-all duration-600"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      <span className="text-xs text-[#a1a1aa] min-w-8 text-right shrink-0">
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

export default function GridProjects({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");
  const router = useRouter();
  const { setSelectedProject } = useProjectStore();
  return (
    <div className="w-full h-full min-w-0 grid grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => {
            router.push(`/projects/${project.id}?tab=calendar`);
            setSelectedProject(project);
          }}
          className="w-full h-full min-w-0 max-w-full background-elevated border background-border rounded-lg p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 md:gap-4 hover:shadow-lg dark:hover:shadow-[#2dd4bf]/20 cursor-pointer overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full min-w-0 border-b-2 background-border pb-2">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <h1 className="text-base sm:text-lg text-primary font-bold truncate">
                {project.name}
              </h1>
              <p className="primary-slate font-semibold text-xs sm:text-sm truncate">
                {project.clientName}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 p-1.5 sm:p-2 border background-border rounded-lg shadow-xl shadow-black/80 shrink-0 max-w-full self-start sm:self-auto ${project.status === "completed" ? "bg-(--accent-green)/30" : project.status === "in_progress" || project.status === "active" ? "bg-(--accent-cyan)/30" : project.status === "cancelled" ? "bg-(--accent-red)/30" : project.status === "on_hold" ? "bg-(--accent-amber)/30" : project.status === "not_started" ? "bg-(--accent-slate)/30" : "bg-(--accent-purple)/30"}`}
            >
              <div
                className={`rounded-full w-3 h-3 sm:w-4 sm:h-4 shrink-0 ${project.status === "completed" ? "bg-(--accent-green)" : project.status === "in_progress" || project.status === "active" ? "bg-(--accent-cyan)" : project.status === "cancelled" ? "bg-(--accent-red)" : project.status === "on_hold" ? "bg-(--accent-amber)" : project.status === "not_started" ? "bg-(--accent-slate)" : "bg-(--accent-purple)"} border shadow-lg shadow-black`}
              ></div>
              <p className="text-xs sm:text-base md:text-lg capitalize tracking-wider text-primary whitespace-nowrap truncate">
                {project.status}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
            <div className="grid grid-cols-3 w-full min-w-0 gap-1 sm:gap-2">
              <p className="text-[10px] sm:text-sm primary-slate uppercase font-semibold flex flex-col items-center gap-1 sm:gap-2 min-w-0">
                {t("revenue")}
                <span className="primary-green text-sm sm:text-xl md:text-2xl font-bold truncate max-w-full">
                  ${project.totalRevenue}
                </span>
              </p>
              <p className="text-[10px] sm:text-sm primary-slate uppercase font-semibold flex flex-col items-center gap-1 sm:gap-2 min-w-0 border-x background-border">
                {t("expenses")}
                <span className="primary-red text-sm sm:text-xl md:text-2xl font-bold truncate max-w-full">
                  ${project.totalExpenses}
                </span>
              </p>
              <p className="text-[10px] sm:text-sm primary-slate uppercase font-semibold flex flex-col items-center gap-1 sm:gap-2 min-w-0">
                {t("profit")}
                <span className="primary-cyan text-sm sm:text-xl md:text-2xl font-bold truncate max-w-full">
                  ${project.totalProfit}
                </span>
              </p>
            </div>
            <div className="w-full min-w-0 flex flex-col gap-2">
              <MarginBar
                value={project.totalMargin ? Number(project.totalMargin) : 0}
              />
              <p className="primary-slate uppercase font-semibold text-xs sm:text-sm">
                {t("profitMargin")}
              </p>
            </div>
          </div>
          <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 pt-2.5 border-t background-border min-w-0">
            <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-3 sm:h-full min-w-0">
              <span className="primary-slate text-xs sm:text-sm font-semibold truncate">
                {t("startedOn")}{" "}
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
              <div className="hidden sm:block border h-full background-border w-0.5"></div>
              <span className="primary-cyan text-xs sm:text-sm font-semibold truncate">
                {t("lastUpdated")}{" "}
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <span className="text-primary text-xs sm:text-sm font-semibold shrink-0">
              ⏱ {project.totalHoursWorked} {t("hours")}
            </span>
          </footer>
        </div>
      ))}
    </div>
  );
}
