import { ClientPageTab, Project } from "@/types/types";
import { create } from "zustand";

type UIStore = {
  isSidebarOpen: boolean;
  sidebarOpen: () => void;
  sidebarClose: () => void;
  clientPageTab: ClientPageTab;
  setClientPageTab: (tab: ClientPageTab) => void;
  isJobsAndProjectsSlideOverOpen: boolean;
  jobsAndProjectsSlideOverOpen: () => void;
  jobsAndProjectsSlideOverClose: () => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  isNewProjectModalLoading: boolean;
  setIsNewProjectModalLoading: (loading: boolean) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: false,
  sidebarOpen: () => set({ isSidebarOpen: true }),
  sidebarClose: () => set({ isSidebarOpen: false }),
  clientPageTab: "overview" as ClientPageTab,
  setClientPageTab: (tab: ClientPageTab) =>
    set({
      clientPageTab: tab,
    }),

  isJobsAndProjectsSlideOverOpen: false,
  jobsAndProjectsSlideOverOpen: () =>
    set({ isJobsAndProjectsSlideOverOpen: true }),
  jobsAndProjectsSlideOverClose: () =>
    set({ isJobsAndProjectsSlideOverOpen: false }),
  selectedProject: null,
  setSelectedProject: (project: Project | null) =>
    set({ selectedProject: project }),
  selectedDate: null,
  setSelectedDate: (date: Date | null) => set({ selectedDate: date }),
  isNewProjectModalLoading: false,
  setIsNewProjectModalLoading: (loading: boolean) => set({ isNewProjectModalLoading: loading }),
}));
