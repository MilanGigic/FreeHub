"use client"

import { MouseEvent, useEffect } from "react";
import { useUIStore } from "@/lib/store/useUIStore";
import { XIcon } from "lucide-react";
import ProjectCalendar from "./ProjectCalendar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SelectedProject() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const projectId = searchParams.get("projectId");
  
  const { selectedProject, setSelectedProject } = useUIStore();

  useEffect(() => {
    if (!selectedProject) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selectedProject]);

  if (!selectedProject) return null;

  if (!projectId) return null;

  const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString());
    params.delete("projectId");

    const newUrl =
      params.toString().length > 0
        ? `${pathname}?${params.toString()}`
        : pathname;

        router.replace(newUrl);
        setSelectedProject(null);
  }

  return (
    <div className="fixed inset-0 min-h-screen bg-black/50 z-40 backdrop-blur-sm p-4 flex flex-col gap-2 md:gap-4 overflow-y-auto">
      <div className="h-16">
        <button
          type="button"
          onClick={(e) => handleClose(e)}
          className="primary-text cursor-pointer border rounded-full p-2 dark:hover:border-[#f85149] hover:border-[#d1242f] transition-all duration-300 ease-in-out"
          aria-label="Close"
          >
          <XIcon size={40} className="text-primary" />
        </button>
      </div>
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
            <p className={`text-sm uppercase font-semibold ${selectedProject.status === "active" ? "primary-green" : selectedProject.status === "in_progress" ? "primary-slate" : selectedProject.status === "completed" ? "primary-green" : selectedProject.status === "cancelled" ? "primary-red" : selectedProject.status === "on_hold" ? "primary-slate" : selectedProject.status === "not_started" ? "primary-red" : "primary-slate"}`}>
                {selectedProject.status}
            </p>
          </div>
        </div>

        <ProjectCalendar key={selectedProject.id} />
    </div>
  )
}
