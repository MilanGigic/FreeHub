import { create } from "zustand";

type UIStore = {
  isSidebarOpen: boolean;
  sidebarOpen: () => void;
  sidebarClose: () => void;
};

export const useUIStore = create<UIStore>((set) => {
  const store = {
    isSidebarOpen: false,
    sidebarOpen: () => set({ isSidebarOpen: true }),
    sidebarClose: () => set({ isSidebarOpen: false }),
  };

  return store;
});
