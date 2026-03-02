import { Client, Project, Invoice } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
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
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  outstandingInvoices: string;
  setOutstandingInvoices: (outstandingInvoices: string) => void;
  overdueInvoices: { data: string; count: number };
  setOverdueInvoices: Dispatch<SetStateAction<{ data: string; count: number }>>;
  amount: string;
  setAmount: (amount: string) => void;
  issueDate: Date;
  setIssueDate: (issueDate: Date) => void;
  dueDate: Date;
  setDueDate: (dueDate: Date) => void;
  note: string;
  setNote: (note: string) => void;
  paidInvoices: string;
  setPaidInvoices: (paidInvoices: string) => void;
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
  invoices: [],
  setInvoices: (invoices: Invoice[]) => set({ invoices }),
  outstandingInvoices: "",
  setOutstandingInvoices: (outstandingInvoices: string) =>
    set({ outstandingInvoices }),
  overdueInvoices: { data: "", count: 0 },
  setOverdueInvoices: (value) =>
    set((state) => ({
      overdueInvoices:
        typeof value === "function" ? value(state.overdueInvoices) : value,
    })),
  amount: "",
  setAmount: (amount: string) => set({ amount }),
  issueDate: new Date(),
  setIssueDate: (issueDate: Date) => set({ issueDate }),
  dueDate: new Date(),
  setDueDate: (dueDate: Date) => set({ dueDate }),
  note: "",
  setNote: (note: string) => set({ note }),
  paidInvoices: "",
  setPaidInvoices: (paidInvoices: string) => set({ paidInvoices }),
}));
