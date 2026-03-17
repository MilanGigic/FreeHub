"use client";

import { fetchClientsProjects } from "@/actions/clients/fetchClientsProjects";
import NewProjectModal from "@/components/Projects/NewProjectModal";
import { useClientStore } from "@/lib/store/useClientStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { Project } from "@/types/types";
import { useEffect } from "react";

function calculateProfitMargin(project: Project) {
  const totalRevenue = project?.totalRevenue ? Number(project.totalRevenue) : 0;

  const profit = project?.totalProfit ? Number(project.totalProfit) : 0;

  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
  return profitMargin.toFixed(2);
}

export default function Projects() {
  const {
    jobsAndProjectsSlideOverOpen,
    setIsNewProjectModalOpen,
    isNewProjectModalOpen,
  } = useUIStore();
  const { setSelectedProject, selectedProject } = useProjectStore();
  const { clientProjects, selectedClient, setClientProjects } =
    useClientStore();

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

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-2 md:gap-4">
      <div className="flex items-start gap-2 relative px-2 md:px-0 md:max-w-md w-full">
        <button
          className="primary-green p-2 w-full rounded-lg border background-border outline-none focus-border-accent transition-all duration-300 ease-out"
          onClick={() => setIsNewProjectModalOpen(true)}
        >
          New Project
        </button>
        {isNewProjectModalOpen ? <NewProjectModal /> : null}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {clientProjects.map((project) => (
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
                Profit:
                <span className="primary-green">${project.totalProfit}</span>
              </p>
              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                Margin:
                <span
                  className={`${Number(calculateProfitMargin(project)) >= 40 ? "primary-green" : Number(calculateProfitMargin(project)) >= 25 ? "primary-slate" : "primary-red"}`}
                >
                  {calculateProfitMargin(project)}%
                </span>
              </p>
              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                Hourly Rate:
                <span className="primary-cyan">
                  $
                  {(project.totalProfit &&
                  Number(project.totalProfit) &&
                  project.totalHoursWorked &&
                  Number(project.totalHoursWorked)
                    ? Number(project.totalProfit) /
                      Number(project.totalHoursWorked)
                    : 0
                  ).toFixed(2)}
                  /hour
                </span>
              </p>
              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                Status:
                <span
                  className={`${project.status === "completed" ? "primary-green" : project.status === "in_progress" ? "primary-slate" : project.status === "cancelled" ? "primary-red" : project.status === "on_hold" ? "primary-slate" : project.status === "not_started" ? "primary-slate" : project.status === "active" ? "primary-purple" : "primary-red"}`}
                >
                  {project.status}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
