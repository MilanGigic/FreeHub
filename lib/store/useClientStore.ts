import { Client, Project } from "@/types/types";
import { create } from "zustand";

type ClientStore = {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  clientProjects: Project[];
  setClientProjects: (projects: Project[]) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  clientNetTakeHome: number;
  setClientNetTakeHome: (netTakeHome: number) => void;
};

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  setClients: (clients: Client[]) => set({ clients }),
  clientProjects: [],
  setClientProjects: (projects: Project[]) => set({ clientProjects: projects }),
  selectedClientId: null,
  setSelectedClientId: (id: string | null) => set({ selectedClientId: id }),
  selectedClient: null,
  setSelectedClient: (client: Client | null) => set({ selectedClient: client }),
  clientNetTakeHome: 0,
  setClientNetTakeHome: (netTakeHome: number) =>
    set({ clientNetTakeHome: netTakeHome }),
}));
