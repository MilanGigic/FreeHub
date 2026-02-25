"use client";

import ProjectCalendar from "./ProjectCalendar";
import CalendarEntries from "./CalendarEntries";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchProjectById } from "@/actions/projects/fetchProjectById";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { fetchDataForSelectedDate } from "@/actions/projects/calendar/fetchDataForSelectedDate";
import SelectedProjectHeader from "./SelectedProjectHeader";
import Revenue from "./Revenue";

const Tabs = ["Calendar", "Revenue"];

export default function SelectedProject() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  const {
    selectedProject,
    selectedDate,
    setSelectedProject,
    setNote,
    setHoursWorked,
  } = useProjectStore();

  useEffect(() => {
    (async () => {
      if (!selectedProject) {
        const projectId = pathname.split("/").pop();
        if (!projectId) return;
        const project = await fetchProjectById(projectId);
        if (project.success) {
          if (!project.data) return;
          setSelectedProject(project.data);
        }
      } else return;
    })();
  }, [setSelectedProject, pathname, selectedProject]);

  useEffect(() => {
    (async () => {
      if (!selectedProject || !selectedDate) return;
      const result = await fetchDataForSelectedDate(
        selectedProject.id,
        selectedDate,
      );
      if (result.success) {
        setNote(result.data?.note ?? "");
        setHoursWorked(result.data?.hoursWorked ?? null);
      }
    })();
  }, [selectedProject, selectedDate, setNote, setHoursWorked]);

  if (!selectedProject) return null;

  return (
    <div className="p-4 flex flex-col gap-2 md:gap-4 w-full h-full">
      <SelectedProjectHeader />

      <div className="flex flex-col w-full justify-center items-center gap-2 md:gap-4 h-full">
        <div className="flex items-center gap-2 justify-center p-2">
          {Tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() =>
                router.push(
                  `/projects/${selectedProject.id}?tab=${tab === "Calendar" ? "calendar" : "revenue"}`,
                )
              }
              className={`text-lg border background-border uppercase font-semibold px-4 py-2 rounded-lg ${activeTab === "calendar" && tab === "Calendar" ? "text-primary bg-(--accent-cyan)/20" : activeTab === "revenue" && tab === "Revenue" ? "text-primary bg-(--accent-green)/20" : "primary-slate hover:text-primary"} hover:cursor-pointer transition-all duration-300 ease-out`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "calendar" ? (
          <div className="flex w-full justify-center items-center gap-2 md:gap-4">
            <ProjectCalendar key={selectedProject.id} />
            <div className="h-full border background-border" />
            <CalendarEntries key={selectedDate?.getTime() ?? "no-date"} />
          </div>
        ) : activeTab === "revenue" ? (
          <Revenue />
        ) : (
          <div>
            <p>No tab selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
