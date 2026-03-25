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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-cyan text-5xl font-bold tracking-widest mb-6">
          {projects.length}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          {t("totalProjects")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-purple text-5xl font-bold tracking-widest mb-6">
          {
            projects.filter(
              (project) =>
                project.status === "active" || project.status === "in_progress",
            ).length
          }
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          {t("activeInProgress")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-green text-5xl font-bold tracking-widest mb-6">
          ${totalRevenue}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          {t("totalRevenue")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-amber text-5xl font-bold tracking-widest mb-6">
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
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          {t("avgMargin")}
        </p>
      </div>
    </div>
  );
}
