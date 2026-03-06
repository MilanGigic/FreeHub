"use client";

import { useEffect, useState } from "react";
import NewProjectModal from "./NewProjectModal";
import { Project } from "@/types/types";
import { useAuth } from "@/lib/useAuth";
import { useDataStore } from "@/lib/store/useDataStore";
import { fetchAllProjects } from "@/actions/projects/fetchAllProjects";
import { toast } from "react-toastify";
import { useUIStore } from "@/lib/store/useUIStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import Link from "next/link";

export default function ProjectsHeader() {
  const { user } = useAuth();
  const { projects, setProjects, totalRevenue, setTotalRevenue } =
    useDataStore();
  const {
    isNewProjectModalLoading,
    setIsNewProjectModalOpen,
    isNewProjectModalOpen,
  } = useUIStore();
  const { setSelectedProject } = useProjectStore();

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Project[]>([]);

  useEffect(() => {
    if (projects.length === 0) return;
    setTotalRevenue(
      projects
        .reduce((acc, project) => acc + Number(project.totalRevenue || 0), 0)
        .toFixed(2)
        .toString(),
    );
  }, [projects, setTotalRevenue]);

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
    (async () => {
      if (!user) return;

      const res = await fetchAllProjects(user.id);

      if (!res.success) {
        toast.error(res.error);
      }

      if (res.data) {
        if (res.data.length > 0) {
          setProjects(res.data);
        }
      }
    })();
  }, [setProjects, user]);

  return (
    <header className="grid grid-cols-1 md:grid-cols-5 gap-2 uppercase w-full">
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Total Projects:{" "}
          <span className="text-2xl font-bold text-primary">
            {projects.length}
          </span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Active Projects:{" "}
          <span className="text-2xl font-bold text-primary">
            {projects.filter((project) => project.status === "active").length}
          </span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Revenue From Projects:{" "}
          <span className="text-2xl font-bold text-primary">
            ${totalRevenue}
          </span>
        </h1>
      </div>

      <div className="flex items-center justify-between w-full border background-border rounded-lg p-4 background-elevated col-span-2 relative h-full gap-2 md:gap-4">
        <div className="flex items-center justify-start w-full relative">
          <input
            type="text"
            placeholder="Search projects"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-2 px-4 rounded-lg border background-border outline-none text-primary focus-border-accent transition-all duration-300 ease-out"
          />
          {query.length > 2 && (
            <div className="absolute top-12 left-0 w-full background-elevated border background-border rounded-lg max-h-[200px] overflow-y-auto">
              {results.map((result) => (
                <Link
                  href={`/projects/${result.id}`}
                  key={result.id}
                  onClick={() => setSelectedProject(result)}
                  className="primary-slate flex items-center justify-start p-2 rounded-lg hover:bg-(--accent-green)/20 transition-all duration-300 ease-out w-full"
                >
                  {result.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        {isNewProjectModalLoading ? (
          <div className="flex justify-center items-center h-full w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--accent-green)" />
          </div>
        ) : (
          <button
            className="primary-green p-2 w-full rounded-lg border background-border outline-none focus-border-accent transition-all duration-300 ease-out"
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            New Project
          </button>
        )}
        {isNewProjectModalOpen && <NewProjectModal />}
      </div>
    </header>
  );
}
