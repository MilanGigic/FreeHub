"use client";

import { fetchClientsProjects } from "@/actions/clients/fetchClientsProjects";
import NewProjectModal from "@/components/Projects/NewProjectModal";
import { useRates } from "@/hooks/useRates";
import { convertMinor, formatMinor, toMinor } from "@/lib/currency";
import { useClientStore } from "@/lib/store/useClientStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";

function mostCommon(
  values: ("USD" | "EUR" | "GBP" | "JPY" | "RSD" | "CAD")[] | undefined,
): string | null {
  if (!values) return null;
  const counts = new Map<string, number>();
  for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export default function Projects({
  displayCurrency: preferred,
}: {
  displayCurrency?: string;
}) {
  const t = useTranslations("jobsAndProjects");
  const p = useTranslations("projects");
  const n = useTranslations("navigation");
  const locale = useLocale();
  const {
    jobsAndProjectsSlideOverOpen,
    setIsNewProjectModalOpen,
    isNewProjectModalOpen,
  } = useUIStore();
  const { setSelectedProject, selectedProject, projectFinances } =
    useProjectStore();
  const { clientProjects, selectedClient, setClientProjects } =
    useClientStore();

  const financeCurrencies = projectFinances?.map((proj) => proj.currency);
  const displayCurrency = preferred ?? mostCommon(financeCurrencies) ?? "USD";

  const rates = useRates([
    ...(financeCurrencies as (string | null | undefined)[]),
    displayCurrency,
  ]);

  const totalsByProject = useMemo(() => {
    if (!rates) return null;

    const map = new Map<string, { income: number; expense: number }>();

    for (const fin of projectFinances ?? []) {
      const minor = convertMinor(
        toMinor(fin.amount),
        fin.currency ?? displayCurrency,
        displayCurrency,
        rates,
      );

      const entry = map.get(fin.projectId) ?? { income: 0, expense: 0 };
      if (fin.type === "income") entry.income += minor;
      if (fin.type === "expense") entry.expense += minor;
      map.set(fin.projectId, entry);
    }

    return map;
  }, [projectFinances, rates, displayCurrency]);

  useEffect(() => {
    if (!selectedClient) {
      return;
    }
    (async () => {
      const res = await fetchClientsProjects(selectedClient.id);
      if (res.success) {
        if (res.data) {
          setClientProjects(res.data);
        }
      }
    })();
  }, [selectedClient, setClientProjects]);

  if (!totalsByProject) return null;

  const fmt = (minor?: number) =>
    minor === undefined ? "—" : formatMinor(minor, displayCurrency, locale);

  if (clientProjects.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-primary text-2xl font-semibold tracking-wide uppercase">
            {p("noProjectsStarted")}
          </h1>
          <p className="primary-slate text-lg">{n("clickBelowNewProject")}</p>
        </div>
        <div className="flex items-start gap-2 relative px-2 md:px-0 md:max-w-md w-full">
          <button
            className={`primary-green p-2 w-full rounded-lg border background-border outline-none transition-all duration-300 ease-out uppercase font-semibold tracking-wide cursor-pointer  
                ${isNewProjectModalOpen ? "bg-(--accent-green)/40 border-(--accent-green)" : "hover:border-(--accent-green) hover:bg-(--accent-green)/20"}
              `}
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            {t("newProject")}
          </button>
          {isNewProjectModalOpen ? <NewProjectModal /> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-2 md:gap-4">
      <div className="flex items-start gap-2 relative px-2 md:px-0 md:max-w-md w-full">
        <button
          className="primary-green p-2 w-full rounded-lg border background-border outline-none focus-border-accent transition-all duration-300 ease-out"
          onClick={() => setIsNewProjectModalOpen(true)}
        >
          {t("newProject")}
        </button>
        {isNewProjectModalOpen ? <NewProjectModal /> : null}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {clientProjects.map((project) => {
          const { income, expense } = totalsByProject.get(project.id) ?? {
            income: 0,
            expense: 0,
          };
          const profit = income - expense;
          const margin = income > 0 ? (profit / income) * 100 : 0;

          // hours are still on the project itself
          const hours = Number(project.totalHoursWorked ?? 0);
          const hourlyMinor = hours > 0 ? Math.round(profit / hours) : 0;

          return (
            <div
              key={project.id}
              className={`p-px bg-linear-to-b ${project.status === "completed" ? "from-(--accent-green) via-[#21262d] to-[#0a0e14]" : project.status === "in_progress" ? "from-(--accent-amber) via-[#21262d] to-[#0a0e14]" : project.status === "cancelled" ? "from-(--accent-red) via-[#21262d] to-[#0a0e14]" : project.status === "on_hold" ? "from-[#21262d] via-[#21262d] to-[#0a0e14]" : project.status === "not_started" ? "from-[#21262d] via-[#21262d] to-[#0a0e14]" : project.status === "active" ? "from-(--accent-purple) via-[#21262d] to-[#0a0e14]" : "from-(--accent-red) via-[#21262d] to-[#0a0e14]"} rounded-lg  ${selectedProject ? (selectedProject.id === project.id ? "scale-105 shadow-xl shadow-[#2dd4bf]/20" : "hover:scale-105 transition-all duration-300 ease-out hover:cursor-pointer hover:shadow-xl hover:shadow-[#2dd4bf]/20 cursor-pointer") : "hover:scale-105 transition-all duration-300 ease-out  hover:shadow-xl hover:shadow-[#2dd4bf]/20"} cursor-pointer`}
              onClick={() => {
                jobsAndProjectsSlideOverOpen();
                setSelectedProject(project);
              }}
            >
              <div className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-2">
                <div className="flex flex-col gap-1 border-b-2 background-border pb-2">
                  <h1 className="text-lg text-primary uppercase font-bold">
                    {project.name}
                  </h1>
                  <p className="primary-slate font-semibold">
                    {project.description}
                  </p>
                </div>
                <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                  {t("profit")}
                  <span className="primary-green">{fmt(profit)}</span>
                </p>
                <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                  {t("margin")}
                  <span
                    className={
                      margin >= 40
                        ? "primary-green"
                        : margin >= 25
                          ? "primary-slate"
                          : "primary-red"
                    }
                  >
                    {margin.toFixed(2)}%
                  </span>
                </p>
                <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                  {t("hourlyRate")}
                  <span className="primary-cyan">
                    {fmt(hourlyMinor)}
                    {t("perHour")}
                  </span>
                </p>
                <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                  {t("status")}
                  <span
                    className={`${project.status === "completed" ? "primary-green" : project.status === "in_progress" ? "primary-slate" : project.status === "cancelled" ? "primary-red" : project.status === "on_hold" ? "primary-slate" : project.status === "not_started" ? "primary-slate" : project.status === "active" ? "primary-purple" : "primary-red"}`}
                  >
                    {project.status}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
