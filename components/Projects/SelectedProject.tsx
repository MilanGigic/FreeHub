"use client";

import CalendarEntries from "./CalendarEntries";
import { MouseEvent, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchProjectById } from "@/actions/projects/fetchProjectById";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { fetchDataForSelectedDate } from "@/actions/projects/calendar/fetchDataForSelectedDate";
import SelectedProjectHeader from "./SelectedProjectHeader";
import SelectedProjectSkeleton from "./SelectedProjectSkeleton";
import Revenue from "./Revenue";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectCalendar from "./ProjectCalendar";
import { useTranslations } from "next-intl";

const tabs = [
  { key: "calendar", labelKey: "calendar" },
  { key: "revenue", labelKey: "revenueTab" },
] as const;

export default function SelectedProject() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "calendar";
  const t = useTranslations("projects");

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

  if (!selectedProject) return <SelectedProjectSkeleton />;

  const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="p-4 flex flex-col gap-2 md:gap-4 w-full h-full">
      <div className="flex w-full p-2 background-elevated gap-2">
        <button
          className="flex items-center gap-2 text-gray-500 uppercase font-semibold hover:text-(--accent-slate) transition-all cursor-pointer"
          onClick={(e) => handleBack(e)}
        >
          <ArrowLeft size={20} />
          {t("back")}
        </button>
        <div className="h-full border background-border" />
        <Link
          href={"/projects"}
          className="text-gray-500 uppercase font-semibold hover:text-(--accent-slate) transition-all"
        >
          {t("title")}
        </Link>
        <div className="h-full border background-border" />
        <h1 className="text-primary uppercase font-semibold">
          {selectedProject.name} -{" "}
          <span className="text-gray-400 lowercase">
            {selectedProject.clientName}
          </span>
        </h1>
      </div>
      <div className="flex items-center gap-2 justify-center p-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() =>
              router.push(
                `/projects/${selectedProject.id}?tab=${tab.key}`,
              )
            }
            className={`text-lg border background-border uppercase font-semibold px-4 py-2 rounded-lg ${activeTab === tab.key ? (tab.key === "calendar" ? "text-primary bg-(--accent-cyan)/20" : "text-primary bg-(--accent-green)/20") : "primary-slate hover:text-primary"} hover:cursor-pointer transition-all duration-300 ease-out`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="flex flex-col w-full justify-center items-center gap-2 md:gap-4 h-full">
        {activeTab === "calendar" ? (
          <div className="grid grid-cols-3 w-full h-full gap-2 md:gap-4">
            <div className="col-span-3">
              <SelectedProjectHeader />
            </div>
            <div className="col-span-2 h-full">
              <ProjectCalendar />
            </div>

            <CalendarEntries key={selectedDate?.getTime() ?? "no-date"} />
          </div>
        ) : activeTab === "revenue" ? (
          <Revenue />
        ) : null}
      </div>
    </div>
  );
}
