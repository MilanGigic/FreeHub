"use client";

import ProjectCalendar from "./ProjectCalendar";
import ProjectDetails from "./ProjectDetails";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { fetchProjectById } from "@/actions/projects/fetchProjectById";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { fetchDataForSelectedDate } from "@/actions/projects/fetchDataForSelectedDate";
import SelectedProjectHeader from "./SelectedProjectHeader";

export default function SelectedProject() {
  const pathname = usePathname();

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

      <div className="flex flex-col w-full justify-center items-center gap-2 md:gap-4">
        <div className="flex w-full justify-center items-center gap-2 md:gap-4">
          <ProjectCalendar key={selectedProject.id} />
          <div className="h-full border background-border" />
          <ProjectDetails key={selectedDate?.getTime() ?? "no-date"} />
        </div>
      </div>
    </div>
  );
}
