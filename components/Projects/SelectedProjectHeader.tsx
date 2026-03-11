"use client";

import { useProjectStore } from "@/lib/store/useProjectStore";

export default function SelectedProjectHeader() {
  const { selectedProject, profit } = useProjectStore();

  if (!selectedProject) return null;
  return (
    <header className="w-full text-center">
      <h1 className="text-4xl font-bold text-primary border-b-2 background-border pb-2">
        {selectedProject.name}
      </h1>

      <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full justify-center md:justify-between border-b-2 background-border p-2 items-center">
        <div className="flex flex-row md:flex-col gap-2 md:gap-4">
          <div className="flex items-center gap-2 px-4 justify-center md:justify-start">
            <div className="w-4 h-4 bg-(--accent-cyan) rounded-full" />
            <h1 className="text-sm text-primary uppercase font-semibold">
              Start Date
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4">
            <div className="w-4 h-4 bg-(--accent-green) rounded-full" />
            <h1 className="text-sm text-primary uppercase font-semibold">
              Today&apos;s date
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4">
            <div className="w-4 h-4 bg-(--accent-purple) rounded-full" />
            <h1 className="text-sm text-primary uppercase font-semibold">
              Selected date -{" "}
            </h1>
          </div>
        </div>
        <p className="text-sm primary-slate">{selectedProject.description}</p>
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-lg text-primary uppercase font-semibold">
              Profit
            </h1>
            <p className="text-sm primary-cyan font-semibold text-center">
              ${profit}
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
      </div>
      <div></div>
    </header>
  );
}
