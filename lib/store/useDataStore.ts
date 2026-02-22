import { Project, ProjectCalendar } from "@/types/types";
import { create } from "zustand";

type DataStore = {
    projects: Project[]
    setProjects: (projects: Project[]) => void
    totalRevenue: number
    setTotalRevenue: (totalRevenue: number) => void
    projectCalendarItem: ProjectCalendar | null
    setProjectCalendarItem: (projectCalendarItem: ProjectCalendar | null) => void
};

export const useDataStore = create<DataStore>((set) => ({
  projects: [],
  setProjects: (projects: Project[]) => set({ projects }),
  totalRevenue: 0,
  setTotalRevenue: (totalRevenue: number) => set({ totalRevenue }),
  projectCalendarItem: null,
  setProjectCalendarItem: (projectCalendarItem: ProjectCalendar | null) => set({ projectCalendarItem }),
}));