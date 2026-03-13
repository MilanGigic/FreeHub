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

const projectStatuses = [
  "all",
  "completed",
  "in_progress",
  "active",
  "cancelled",
  "on_hold",
  "not_started",
];

function filterProjects(projects: Project[], status: ProjectStatus | "all") {
  if (status === "all") return projects;
  return projects.filter((project) => project.status === status);
}

export default function ProjectsMain() {
  const { projects, setProjects } = useDataStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState<ProjectStatus | "all">("all");
  const [view, setView] = useState<"list" | "grid">("grid");

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Project[]>([]);

  const {
    isNewProjectModalLoading,
    setIsNewProjectModalOpen,
    isNewProjectModalOpen,
  } = useUIStore();

  const { user } = useAuth();

  const MAX_GRID_PROJECTS = 4;
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

  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4">
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
      <div className="w-full flex flex-col gap-2 h-full">
        <div className="flex w-full border background-border rounded-lg justify-between items-center gap-2 h-full relative">
          <div className="flex w-full">
            {projectStatuses.map((status, index) => (
              <div
                key={status}
                className={`flex items-center gap-2 p-2 cursor-pointer
              ${show === status.toLowerCase() ? "bg-(--accent-cyan)/30 border-background-border" : "hover:bg-(--accent-cyan)/30"}
                ${index === 0 ? "rounded-l-lg" : index === projectStatuses.length - 1 ? "rounded-r-lg" : ""}
                ${
                  index === 1
                    ? "border-x-2 background-border"
                    : index > 1 && index < projectStatuses.length - 1
                      ? "border-r-2 background-border"
                      : ""
                }`}
                onClick={() => setShow(status as ProjectStatus)}
              >
                <p className="text-primary">
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("_", " ")}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center w-full h-full justify-between gap-4">
            <div className="w-full flex items-center h-full justify-center">
              <input
                type="text"
                placeholder="Search projects"
                className="p-2 w-full text-center rounded-lg border background-border outline-none text-primary focus-border-accent transition-all duration-300 ease-out placeholder:text-tertiary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {view === "grid" ? (
              <TableProperties
                className="w-10 h-10 text-primary cursor-pointer"
                onClick={() => setView("list")}
              />
            ) : (
              <Grid2x2
                className="w-10 h-10 text-primary cursor-pointer"
                onClick={() => setView("grid")}
              />
            )}
            <p className="border background-border text-primary px-2 background-elevated flex items-center gap-0.5 w-40 justify-center">
              {/* Show the current page of the projects when pagination is added */}
              (1) of (2)
            </p>
            <button
              className="primary-cyan text-sm font-semibold uppercase rounded-lg hover:bg-(--accent-cyan)/30 transition-all duration-300 ease-out flex items-center gap-0.5 h-full px-2 cursor-pointer w-xs justify-center py-2"
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          {isNewProjectModalOpen ? <NewProjectModal /> : null}
        </div>
        {query.length > 2 && results.length > 0 ? (
          <GridProjects projects={results} />
        ) : filteredProjects.length > 0 ? (
          <GridProjects projects={filteredProjects} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-primary">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
}
