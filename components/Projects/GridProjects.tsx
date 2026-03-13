"use client";

import { useProjectStore } from "@/lib/store/useProjectStore";
import { Project } from "@/types/types";
import { useRouter } from "next/navigation";

function MarginBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-4 bg-[#27272a] rounded-md overflow-hidden">
        <div
          className={`h-full w-[${value}%] bg-[${color}] rounded-md transition-all duration-600`}
        />
      </div>
      <span className="text-xs text-[#a1a1aa] min-w-8 text-right">
        {value}%
      </span>
    </div>
  );
}

export default function GridProjects({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const { setSelectedProject } = useProjectStore();
  return (
    <div className="w-full h-full grid grid-cols-1 xl:grid-cols-2 gap-2 md:gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => {
            router.push(`/projects/${project.id}?tab=calendar`);
            setSelectedProject(project);
          }}
          className="w-full h-full background-elevated border background-border rounded-lg p-4 flex flex-col gap-2 md:gap-4 hover:shadow-lg dark:hover:shadow-[#2dd4bf]/20 cursor-pointer"
        >
          <div className="flex w-full justify-between items-center border-b-2 background-border pb-2">
            <div className="flex flex-col gap-1">
              <h1 className="text-lg text-primary font-bold">{project.name}</h1>
              <p className="primary-slate font-semibold text-sm">
                {project.clientName}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 p-2 border background-border rounded-lg shadow-xl shadow-black/80 ${project.status === "completed" ? "bg-(--accent-green)/30" : project.status === "in_progress" || project.status === "active" ? "bg-(--accent-cyan)/30" : project.status === "cancelled" ? "bg-(--accent-red)/30" : project.status === "on_hold" ? "bg-(--accent-amber)/30" : project.status === "not_started" ? "bg-(--accent-slate)/30" : "bg-(--accent-purple)/30"}`}
            >
              <div
                className={`rounded-full w-4 h-4 ${project.status === "completed" ? "bg-(--accent-green)" : project.status === "in_progress" || project.status === "active" ? "bg-(--accent-cyan)" : project.status === "cancelled" ? "bg-(--accent-red)" : project.status === "on_hold" ? "bg-(--accent-amber)" : project.status === "not_started" ? "bg-(--accent-slate)" : "bg-(--accent-purple)"} border shadow-lg shadow-black`}
              ></div>
              <p className="text-lg capitalize tracking-wider text-primary">
                {project.status}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between gap-4">
              <p className="text-sm primary-slate uppercase font-semibold gap-2 flex flex-col items-center">
                Revenue
                <span className="primary-green text-2xl font-bold">
                  ${project.totalRevenue}
                </span>
              </p>
              <div className="border h-full background-border w-0.5"></div>
              <p className="text-sm primary-slate uppercase font-semibold gap-2 flex flex-col items-center">
                Expenses
                <span className="primary-red text-2xl font-bold">
                  ${project.totalExpenses}
                </span>
              </p>
              <div className="border h-full background-border w-0.5"></div>
              <p className="text-sm primary-slate uppercase font-semibold gap-2 flex flex-col items-center">
                Profit
                <span className="primary-cyan text-2xl font-bold">
                  ${project.totalProfit}
                </span>
              </p>
            </div>
            <div className="w-full flex flex-col gap-2">
              <MarginBar
                value={project.totalMargin ? Number(project.totalMargin) : 0}
                color="primary-cyan"
              />
              <p className="primary-slate uppercase font-semibold text-sm">
                Profit Margin
              </p>
            </div>
          </div>
          <footer className="flex justify-between items-center pt-2.5 border-t background-border">
            <div className="flex gap-3 h-full">
              <span className="primary-slate text-lg font-semibold">
                Started on: {new Date(project.createdAt).toLocaleDateString()}
              </span>
              <div className="border h-full background-border w-0.5"></div>
              <span className="primary-cyan text-lg font-semibold">
                Last Updated: {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <span className="text-primary text-lg font-semibold">
              ⏱ {project.totalHoursWorked} hours
            </span>
          </footer>
        </div>
      ))}
    </div>
  );
}
