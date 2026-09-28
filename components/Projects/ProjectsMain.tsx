"use client";

import { fetchAllProjects } from "@/actions/projects/fetchAllProjects";
import { useDataStore } from "@/lib/store/useDataStore";
import { useAuth } from "@/lib/useAuth";
import { Project, ProjectStatus } from "@/types/types";
import { Grid2x2, Loader2, Plus, TableProperties } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import GridProjects from "./GridProjects";
import NewProjectModal from "./NewProjectModal";
import { useUIStore } from "@/lib/store/useUIStore";
import { useTranslations } from "next-intl";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useRates } from "@/hooks/useRates";
import { convertMinor, toMinor } from "@/lib/currency";

const projectStatuses = [
  "all",
  "completed",
  "in_progress",
  "active",
  "cancelled",
  "on_hold",
  "not_started",
];

function mostCommon(
  values: ("USD" | "EUR" | "GBP" | "JPY" | "RSD" | "CAD")[] | undefined,
): string | null {
  if (!values) return null;
  const counts = new Map<string, number>();
  for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function filterProjects(projects: Project[], status: ProjectStatus | "all") {
  if (status === "all") return projects;
  return projects.filter((project) => project.status === status);
}

export default function ProjectsMain({
  displayCurrency: preferred,
}: {
  displayCurrency?: string;
}) {
  const t = useTranslations("projects");
  const { projects, setProjects } = useDataStore();
  const { projectFinances } = useProjectStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState<ProjectStatus | "all">("all");
  const [view, setView] = useState<"list" | "grid">("grid");

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Project[]>([]);

  const { setIsNewProjectModalOpen, isNewProjectModalOpen } = useUIStore();

  const { user } = useAuth();

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

  const statusLabels: Record<string, string> = {
    all: t("statusAll"),
    completed: t("statusCompleted"),
    in_progress: t("statusInProgress"),
    active: t("statusActive"),
    cancelled: t("statusCancelled"),
    on_hold: t("statusOnHold"),
    not_started: t("statusNotStarted"),
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      const res = await fetch(
        `/api/query-project?q=${query}&userId=${user.id}`,
      );
      const data = await res.json();
      setResults(data);
    };
    fetchResults();
  }, [query, user]);

  useEffect(() => {
    if (!user) return;
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchAllProjects(user.id);
        if (res.success) {
          if (res.data) {
            setProjects(res.data);
          }
        }
      } catch (error) {
        setError(error as string);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [user, setProjects]);

  const filteredProjects = useMemo(
    () => filterProjects(projects, show),
    [projects, show],
  );

  if (!totalsByProject) return null;
  return (
    <div className="w-full h-full max-w-full flex flex-col gap-2 md:gap-4 overflow-x-hidden min-w-0">
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {error && (
        <div className="w-full h-full flex items-center justify-center">
          <p className="primary-red">{error}</p>
        </div>
      )}
      <div className="w-full min-w-0 flex flex-col gap-2 h-full">
        <div className="flex flex-col lg:flex-row w-full min-w-0 border background-border rounded-lg gap-2 lg:gap-2 relative p-2 lg:p-0">
          {/* Status filter pills: horizontally scrollable on phones/tablets, inline row on large screens */}
          <div className="flex w-full min-w-0 lg:w-auto lg:shrink-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:rounded-l-lg">
            {projectStatuses.map((status, index) => (
              <div
                key={status}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-2 cursor-pointer whitespace-nowrap shrink-0
              ${show === status.toLowerCase() ? "bg-(--accent-cyan)/30 border-background-border" : "hover:bg-(--accent-cyan)/30"}
                ${index === 0 ? "lg:rounded-l-lg" : index === projectStatuses.length - 1 ? "lg:rounded-r-lg" : ""}
                ${
                  index === 1
                    ? "border-x-2 background-border"
                    : index > 1 && index < projectStatuses.length - 1
                      ? "border-r-2 background-border"
                      : ""
                }`}
                onClick={() => setShow(status as ProjectStatus)}
              >
                <p className="text-primary text-xs sm:text-sm md:text-base">
                  {statusLabels[status]}
                </p>
              </div>
            ))}
          </div>

          {/* Search, view toggle, count, new project */}
          <div className="flex flex-col md:flex-row md:items-stretch sm:items-center w-full min-w-0 gap-2 sm:gap-3 lg:gap-4 lg:pr-2 lg:py-1">
            <div className="w-full min-w-0 flex items-center justify-center">
              <input
                type="text"
                placeholder={t("searchProjects")}
                className="p-2 w-full min-w-0 text-center rounded-lg border background-border outline-none text-primary focus-border-accent transition-all duration-300 ease-out placeholder:text-tertiary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3 min-w-0">
              {view === "grid" ? (
                <TableProperties
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-primary cursor-pointer shrink-0"
                  onClick={() => setView("list")}
                />
              ) : (
                <Grid2x2
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-primary cursor-pointer shrink-0"
                  onClick={() => setView("grid")}
                />
              )}
              <p className="border background-border text-primary px-2 py-1.5 background-elevated flex items-center gap-0.5 justify-center whitespace-nowrap text-xs sm:text-sm shrink-0">
                {filteredProjects.length}{" "}
                {filteredProjects.length === 1 ? t("project") : t("projects")}
              </p>
              <button
                className="primary-cyan text-xs sm:text-sm font-semibold uppercase rounded-lg hover:bg-(--accent-cyan)/30 transition-all duration-300 ease-out flex items-center gap-1 cursor-pointer justify-center py-2 px-2 sm:px-3 shrink-0 whitespace-nowrap"
                onClick={() => setIsNewProjectModalOpen(true)}
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{t("newProject")}</span>
              </button>
            </div>
          </div>

          {isNewProjectModalOpen ? <NewProjectModal /> : null}
        </div>
        {query.length > 2 && results.length > 0 ? (
          <GridProjects
            projects={results}
            totals={totalsByProject}
            displayCurrency="RSD"
          />
        ) : filteredProjects.length > 0 ? (
          <GridProjects
            projects={filteredProjects}
            totals={totalsByProject}
            displayCurrency="RSD"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-primary">{t("noProjectsFound")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
