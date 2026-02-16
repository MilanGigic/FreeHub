"use client";

import JobsAndProjectsSlideOver from "@/components/Clients/ClientPage/JobsAndProjects/JobsAndProjectsSlideOver";
import { useUIStore } from "@/lib/store/useUIStore";
import { Project } from "@/types/types";
import { useState } from "react";

const projects = [
  {
    id: 1,
    name: "Project 1",
    description: "Project 1 description",
    revenue: 1000,
    expenses: 500,
    profit: 500,
    margin: 50,
    hourlyRate: 100,
    hoursWorked: 10,
    status: "Done",
  },
  {
    id: 2,
    name: "Project 2",
    description: "Project 2 description",
    revenue: 2000,
    expenses: 1000,
    profit: 1000,
    margin: 20,
    hourlyRate: 100,
    hoursWorked: 10,
    status: "In Progress",
  },
  {
    id: 3,
    name: "Project 3",
    description: "Project 3 description",
    revenue: 3000,
    expenses: 1500,
    profit: 1500,
    margin: 30,
    hourlyRate: 100,
    hoursWorked: 10,
    status: "In Progress",
  },
  {
    id: 4,
    name: "Project 4",
    description: "Project 4 description",
    revenue: 4000,
    expenses: 2000,
    profit: 2000,
    margin: 40,
    hourlyRate: 100,
    hoursWorked: 10,
    status: "Cancelled",
  },
  {
    id: 5,
    name: "Project 5",
    description: "Project 5 description",
    revenue: 5000,
    expenses: 2500,
    profit: 2500,
    margin: 50,
    hourlyRate: 100,
    hoursWorked: 10,
    status: "Done",
  },
];

export default function JobsAndProjectsPage() {
  const { jobsAndProjectsSlideOverOpen, isJobsAndProjectsSlideOverOpen } =
    useUIStore();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4">
      <div className="flex items-center justify-center">
        <input
          type="text"
          placeholder="Search projects"
          className="p-2 w-64 md:w-md text-center rounded-lg border background-border outline-none focus:border-[#2dd4bf] transition-all duration-300 ease-out"
        />
      </div>
      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`p-px bg-linear-to-b ${project.status === "Done" ? "from-[#34d399] via-[#21262d] to-[#0a0e14]" : project.status === "In Progress" ? "from-[#d29922] via-[#21262d] to-[#0a0e14]" : "from-[#f85149] via-[#21262d] to-[#0a0e14]"} rounded-lg hover:scale-105 transition-all duration-300 ease-out hover:cursor-pointer hover:shadow-xl hover:shadow-[#2dd4bf]/20`}
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
                <p className="text-secondary font-semibold">
                  {project.description}
                </p>
              </div>
              <p className="text-sm text-secondary uppercase font-semibold flex items-center gap-2">
                Revenue:
                <span className="primary-green">${project.revenue}</span>
              </p>
              <p className="text-sm text-secondary uppercase font-semibold flex items-center gap-2">
                Expenses:
                <span className="primary-red">${project.expenses}</span>
              </p>
              <p className="text-sm text-secondary uppercase font-semibold flex items-center gap-2">
                Profit:<span className="primary-green">${project.profit}</span>
              </p>
              <p className="text-sm text-secondary uppercase font-semibold flex items-center gap-2">
                Margin:
                <span
                  className={`${project.margin >= 40 ? "primary-green" : project.margin >= 25 ? "primary-slate" : "primary-red"}`}
                >
                  {project.margin}%
                </span>
              </p>
              <p className="text-sm text-secondary uppercase font-semibold flex items-center gap-2">
                Hourly Rate:
                <span className="primary-cyan">${project.hourlyRate}/hour</span>
              </p>
              <p className="text-sm text-secondary uppercase font-semibold flex items-center gap-2">
                Hours Worked:
                <span className="primary-cyan">
                  {project.hoursWorked} hours
                </span>
              </p>
              <p className="text-sm text-secondary uppercase font-semibold flex items-center gap-2">
                Status:
                <span
                  className={`${project.status === "Done" ? "primary-green" : project.status === "In Progress" ? "primary-slate" : "primary-red"}`}
                >
                  {project.status}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
      {isJobsAndProjectsSlideOverOpen ? (
        <JobsAndProjectsSlideOver selectedProject={selectedProject} />
      ) : null}
    </div>
  );
}
