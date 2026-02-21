import { Project } from "@/types/types";
import { create } from "zustand";

type DataStore = {
    projects: Project[]
    setProjects: (projects: Project[]) => void
    totalRevenue: number
    setTotalRevenue: (totalRevenue: number) => void
}

export const useDataStore = create<DataStore>((set) => ({
    projects: [],
    setProjects: (projects: Project[]) => set({ projects }),
    totalRevenue: 0,
    setTotalRevenue: (totalRevenue: number) => set({ totalRevenue }),
}))