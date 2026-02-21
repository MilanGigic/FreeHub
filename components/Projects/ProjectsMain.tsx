"use client"

import { fetchAllProjects } from "@/actions/projects/fetchAllProjects";
import { useDataStore } from "@/lib/store/useDataStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { useAuth } from "@/lib/useAuth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectsMain() {
  const router = useRouter()
  const {setSelectedProject} = useUIStore()
  const {projects, setProjects} = useDataStore()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

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

  return <div className="w-full h-full flex flex-col gap-2 md:gap-4">
    {isLoading && <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="w-4 h-4 animate-spin" />
    </div>}
    {error && <div className="w-full h-full flex items-center justify-center">
      <p className="primary-red">{error}</p>
    </div>}
    {projects.length > 0 && (
      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
      {projects.map((project) => (
        <div key={project.id} onClick={() => {router.push(`/projects?projectId=${project.id}`); setSelectedProject(project)}} className="w-full h-full background-elevated border background-border rounded-lg p-4 flex flex-col gap-2 md:gap-4 hover:shadow-lg dark:hover:shadow-[#2dd4bf]/20 cursor-pointer">
          <h1 className="text-lg text-primary uppercase font-bold">{project.name}</h1>
          <p className="primary-slate font-semibold">
            {project.description}
          </p>
          <p className="primary-green font-semibold">
            <span className="primary-slate">Revenue: </span>${project.revenue}
          </p>
          <p className={`${project.status === "completed" ? "primary-green" : project.status === "in_progress" ? "primary-cyan" : project.status === "cancelled" ? "primary-red" : project.status === "on_hold" ? "primary-amber" : project.status === "not_started" ? "primary-slate" : "primary-purple"} font-semibold uppercase`}>
            <span className="primary-slate capitalize font-semibold">Status: </span>{project.status}
          </p>
        </div>
      ))}
    </div>
    ) 
    }
  </div>;
}
