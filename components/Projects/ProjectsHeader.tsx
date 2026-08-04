"use client";

import { Project } from "@/types/types";
import { useTranslations } from "next-intl";

export default function ProjectsHeader({
  projects,
  totalRevenue,
}: {
  projects: Project[];
  totalRevenue: string;
}) {
  const t = useTranslations("projects");
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full min-w-0">
      <div className="background-elevated border background-border flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-2.5 sm:p-4 w-full min-w-0 overflow-hidden">
        <p className="primary-cyan text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide sm:tracking-widest mb-1.5 sm:mb-4 md:mb-6 truncate max-w-full">
          {projects.length}
        </p>
        <p className="text-primary text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-wide sm:tracking-widest text-center leading-tight break-words">
          {t("totalProjects")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-2.5 sm:p-4 w-full min-w-0 overflow-hidden">
        <p className="primary-purple text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide sm:tracking-widest mb-1.5 sm:mb-4 md:mb-6 truncate max-w-full">
          {
            projects.filter(
              (project) =>
                project.status === "active" || project.status === "in_progress",
            ).length
          }
        </p>
        <p className="text-primary text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-wide sm:tracking-widest text-center leading-tight break-words">
          {t("activeInProgress")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-2.5 sm:p-4 w-full min-w-0 overflow-hidden">
        <p className="primary-green text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide sm:tracking-widest mb-1.5 sm:mb-4 md:mb-6 truncate max-w-full">
          ${totalRevenue}
        </p>
        <p className="text-primary text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-wide sm:tracking-widest text-center leading-tight break-words">
          {t("totalRevenue")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-2.5 sm:p-4 w-full min-w-0 overflow-hidden">
        <p className="primary-amber text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide sm:tracking-widest mb-1.5 sm:mb-4 md:mb-6 truncate max-w-full">
          {projects.length > 0
            ? (
                projects.reduce(
                  (acc, project) => acc + Number(project.totalMargin || 0),
                  0,
                ) / projects.length
              ).toFixed(2)
            : "0.00"}
          %
        </p>
        <p className="text-primary text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-wide sm:tracking-widest text-center leading-tight break-words">
          {t("avgMargin")}
        </p>
      </div>
    </div>
  );
}
