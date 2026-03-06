import { ClientPageTab } from "@/types/types";
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
  isNewProjectModalLoading: boolean;
  setIsNewProjectModalLoading: (loading: boolean) => void;
  selectedProjectTab: "Calendar" | "Revenue";
  setSelectedProjectTab: (tab: "Calendar" | "Revenue") => void;
  isRegisterWindowOpen: boolean;
  setIsRegisterWindowOpen: (open: boolean) => void;
  isNewProjectModalOpen: boolean;
  setIsNewProjectModalOpen: (open: boolean) => void;
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
  isNewProjectModalLoading: false,
  setIsNewProjectModalLoading: (loading: boolean) =>
    set({ isNewProjectModalLoading: loading }),
  selectedProjectTab: "Calendar",
  setSelectedProjectTab: (tab: "Calendar" | "Revenue") =>
    set({ selectedProjectTab: tab }),
  isRegisterWindowOpen: false,
  setIsRegisterWindowOpen: (open: boolean) =>
    set({ isRegisterWindowOpen: open }),
  isNewProjectModalOpen: false,
  setIsNewProjectModalOpen: (open: boolean) =>
    set({ isNewProjectModalOpen: open }),
}));
