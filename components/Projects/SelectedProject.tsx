"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store/useUIStore";
import ProjectCalendar from "./ProjectCalendar";
import ProjectDetails from "./ProjectDetails";

export default function SelectedProject() {
  const { selectedProject, selectedDate } = useUIStore();

  useEffect(() => {
    if (!selectedProject) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selectedProject]);

  if (!selectedProject) return null;

  return (
    <div className="p-4 flex flex-col gap-2 md:gap-4 w-full h-full">
      <header className="w-full text-center">
        <h1 className="text-4xl font-bold text-primary border-b-2 background-border pb-2">
          {selectedProject.name}
        </h1>
        <p className="text-sm primary-slate border-b-2 background-border p-2">
          {selectedProject.description}
        </p>
      </header>
      <div className="flex gap-2 md:gap-4 w-full justify-center">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-lg text-primary uppercase font-semibold">
            Revenue
          </h1>
          <p className="text-sm primary-slate text-center">
            ${selectedProject.revenue}
          </p>
        </div>
        <div className="border h-full background-border" />
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-lg text-primary uppercase font-semibold">
            Status
          </h1>
          <p
            className={`text-sm uppercase font-semibold ${selectedProject.status === "active" ? "primary-green" : selectedProject.status === "in_progress" ? "primary-slate" : selectedProject.status === "completed" ? "primary-green" : selectedProject.status === "cancelled" ? "primary-red" : selectedProject.status === "on_hold" ? "primary-slate" : selectedProject.status === "not_started" ? "primary-red" : "primary-slate"}`}
          >
            {selectedProject.status}
          </p>
        </div>
      </div>

      <div className="flex w-full justify-center items-center gap-2 md:gap-4">
        <ProjectCalendar key={selectedProject.id} />
        <div className="h-full border background-border" />
        <ProjectDetails key={selectedDate?.getTime() ?? "no-date"} />
      </div>
    </div>
  );
}
