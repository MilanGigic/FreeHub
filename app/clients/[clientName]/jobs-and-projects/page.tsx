"use client";

import JobsAndProjectsSlideOver from "@/components/Clients/ClientPage/JobsAndProjects/JobsAndProjectsSlideOver";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { useEffect } from "react";
import { useClientStore } from "@/lib/store/useClientStore";
import { fetchClientsProjects } from "@/actions/clients/fetchClientsProjects";

export default function JobsAndProjectsPage() {
  const { jobsAndProjectsSlideOverOpen, isJobsAndProjectsSlideOverOpen } =
    useUIStore();

  const { setSelectedProject, selectedProject } = useProjectStore();
  const { clientProjects, selectedClientId, setClientProjects } =
    useClientStore();

  useEffect(() => {
    if (!selectedClientId) {
      return;
    }
    (async () => {
      const res = await fetchClientsProjects(selectedClientId as string);
      if (res.success) {
        if (res.data) {
          setClientProjects(res.data);
        }
      }
    })();
  }, [selectedClientId, setClientProjects]);

  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4">
      <div className="flex items-center justify-center">
        <input
          type="text"
          placeholder="Search projects"
          className="p-2 w-64 md:w-md text-center rounded-lg border background-border outline-none text-primary focus-border-accent transition-all duration-300 ease-out placeholder:text-tertiary"
        />
      </div>
      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {clientProjects.map((project) => (
          <div
            key={project.id}
            className={`p-px bg-linear-to-b ${project.status === "completed" ? "from-(--accent-green) via-[#21262d] to-[#0a0e14]" : project.status === "in_progress" ? "from-(--accent-amber) via-[#21262d] to-[#0a0e14]" : project.status === "cancelled" ? "from-(--accent-red) via-[#21262d] to-[#0a0e14]" : project.status === "on_hold" ? "from-[#21262d] via-[#21262d] to-[#0a0e14]" : project.status === "not_started" ? "from-[#21262d] via-[#21262d] to-[#0a0e14]" : project.status === "active" ? "from-(--accent-purple) via-[#21262d] to-[#0a0e14]" : "from-(--accent-red) via-[#21262d] to-[#0a0e14]"} rounded-lg  ${selectedProject ? (selectedProject.id === project.id ? "scale-105 shadow-xl shadow-[#2dd4bf]/20" : "hover:scale-105 transition-all duration-300 ease-out hover:cursor-pointer hover:shadow-xl hover:shadow-[#2dd4bf]/20 cursor-pointer") : "hover:scale-105 transition-all duration-300 ease-out  hover:shadow-xl hover:shadow-[#2dd4bf]/20 cursor-pointer"}`}
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
                  className={`${project.totalMargin && Number(project.totalMargin) >= 40 ? "primary-green" : project.totalMargin && Number(project.totalMargin) >= 25 ? "primary-slate" : "primary-red"}`}
                >
                  {project.totalMargin && Number(project.totalMargin)}%
                </span>
              </p>
              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                Hourly Rate:
                <span className="primary-cyan">
                  ${project.totalHoursWorked}/hour
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
      {isJobsAndProjectsSlideOverOpen ? <JobsAndProjectsSlideOver /> : null}
    </div>
  );
}
