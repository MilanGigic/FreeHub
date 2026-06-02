"use client";

import { useDataStore } from "@/lib/store/useDataStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useAuth } from "@/lib/useAuth";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
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
      <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg h-full">
        <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full text-xl font-bold uppercase text-center">
          {t("loginToViewProjects")}
        </div>
      </div>
    );

  return (
    <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg h-full">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-between items-center gap-2 w-full h-full">
        <header className="w-full text-2xl font-bold text-primary text-center uppercase flex flex-col border-b-2 background-border pb-4">
          <h1>{t("projectsOverview")}</h1>
        </header>
        <main className="flex flex-col gap-2 space-y-1.5 text-sm items-center w-full">
          <div className="flex justify-center gap-4">
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("totalProjects")}{" "}
              <span className="font-bold primary-green">{projects.length}</span>
            </p>
            <p className="text-lg primary-slate font-semibold uppercase">
              {t("activeProjects")}{" "}
              <span className="font-bold primary-green">
                {activeProjects.length}
              </span>
            </p>
          </div>

          {activeProjects.length > 0 && (
            <table className="w-full">
              <thead className="border-b-2 background-border w-full">
                <tr>
                  {projectListHeaderKeys.map((key) => (
                    <th
                      key={key}
                      className="text-sm font-semibold primary-slate text-center pb-2"
                    >
                      {t(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="w-full max-h-[200px] overflow-y-auto">
                {activeProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b background-border text-center primary-slate cursor-pointer hover:bg-(--bg-elevated) transition-all duration-300 ease-out"
                    onClick={() => {
                      router.push(`/projects/${project.id}`);
                      setSelectedProject(project);
                    }}
                  >
                    <td className="text-sm text-primary py-2">
                      {project.name}
                    </td>
                    <td className="primary-slate">{project.description}</td>
                    <td className="primary-green">
                      {project.totalRevenue} RSD
                    </td>
                    <td className="primary-red">{project.totalExpenses} RSD</td>
                    <td className="primary-green">{project.totalProfit} RSD</td>
                    <td className="primary-purple">
                      {project.totalHoursWorked}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>

        <Link
          href="/projects"
          className="text-primary underline w-full flex items-center justify-center gap-2 text-2xl font-bold uppercase hover:text-(--accent-cyan) transition-colors duration-300"
        >
          {t("goToProjects")}
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
