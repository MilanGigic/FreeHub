"use client";

import { useEffect, useState } from "react";
import NewProjectModal from "./NewProjectModal";
import { Project } from "@/types/types";
import { useAuth } from "@/lib/useAuth";
import { useDataStore } from "@/lib/store/useDataStore";
import { fetchAllProjects } from "@/actions/projects/fetchAllProjects";
import { toast } from "react-toastify";
import { useUIStore } from "@/lib/store/useUIStore";

export default function ProjectsHeader() {
  const { user } = useAuth();
  const {projects, setProjects, totalRevenue, setTotalRevenue} = useDataStore()
  const { isNewProjectModalLoading } = useUIStore()
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] =
    useState<boolean>(false);

  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Project[]>([]);

  useEffect(() => {
    setTotalRevenue(projects.reduce((acc, project) => acc + Number(project.revenue || 0), 0))
  }, [projects, setTotalRevenue])

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

      const res = await fetchAllProjects(user.id)

      if (!res.success) {
        toast.error(res.error)
      }

      if (res.data) {
        if (res.data.length > 0) {
          setProjects(res.data)
        }
      }
    })()
  }, [setProjects, user])

  
  return (
    <header className="grid grid-cols-1 md:grid-cols-5 gap-2 uppercase w-full">
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Total Projects: <span className="text-2xl font-bold text-primary">{projects.length}</span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Active Projects: <span className="text-2xl font-bold text-primary">{projects.filter((project) => project.status === "active").length}</span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Revenue From Projects:{" "}
          <span className="text-2xl font-bold text-primary">${totalRevenue}</span>
        </h1>
      </div>

      <div className="flex items-center justify-between w-full border background-border rounded-lg p-4 background-elevated col-span-2 relative h-full gap-2 md:gap-4">
        <div className="flex items-center justify-start w-full relative">
          <input
            type="text"
            placeholder="Search projects"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 rounded-lg border background-border outline-none text-primary focus-border-accent transition-all duration-300 ease-out"
          />
          {query.length > 2 && (
            <div className="absolute top-12 left-0 w-full background-elevated border background-border rounded-lg p-4">
              {results.map((result) => (
                <div key={result.id} className="primary-slate">
                  {result.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {isNewProjectModalLoading ? 
(
  <div className="flex justify-center items-center h-full w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-green)]" />
    </div>
) : (

  <button
  className="primary-green p-2 w-full rounded-lg border background-border outline-none focus-border-accent transition-all duration-300 ease-out"
  onClick={() => setIsNewProjectModalOpen(true)}
  >
   New Project
        </button>
        )}
        {isNewProjectModalOpen && (
          <NewProjectModal
            setIsNewProjectModalOpen={setIsNewProjectModalOpen}
          />
        )}
      </div>
    </header>
  );
}
