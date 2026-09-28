import { Invoice, Project, ProjectRevenue } from "@/types/types";
import { create } from "zustand";

export type ProjectFinance = {
  id: string;
  userId: string;
  projectId: string;
  type: "income" | "expense";
  amount: string;
  currency: "USD" | "EUR" | "GBP" | "JPY" | "RSD" | "CAD";
  note: string;
  hourlyRate: string;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectStore = {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  projectFinances: ProjectFinance[] | null;
  setProjectFinances: (projectFinances: ProjectFinance[] | null) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  note: string;
  setNote: (note: string) => void;
  hoursWorked: number | null;
  setHoursWorked: (hoursWorked: number | null) => void;
  profit: string;
  setProfit: (profit: string) => void;
  revenueList: ProjectRevenue[];
  setRevenueList: (revenueList: ProjectRevenue[]) => void;
  expenseList: ProjectRevenue[];
  setExpenseList: (expenseList: ProjectRevenue[]) => void;
  paidInvoices: Invoice[];
  setPaidInvoices: (paidInvoices: Invoice[]) => void;
  activeProjects: Project[];
  setActiveProjects: (activeProjects: Project[]) => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
  selectedProject: null,
  setSelectedProject: (project: Project | null) =>
    set({ selectedProject: project }),
  projectFinances: null,
  setProjectFinances: (projectFinances: ProjectFinance[] | null) =>
    set({ projectFinances }),
  selectedDate: null,
  setSelectedDate: (date: Date | null) => set({ selectedDate: date }),
  note: "",
  setNote: (note: string) => set({ note }),
  hoursWorked: null,
  setHoursWorked: (hoursWorked: number | null) => set({ hoursWorked }),
  profit: "0",
  setProfit: (profit: string) => set({ profit }),
  revenueList: [],
  setRevenueList: (revenueList: ProjectRevenue[]) => set({ revenueList }),
  expenseList: [],
  setExpenseList: (expenseList: ProjectRevenue[]) => set({ expenseList }),
  paidInvoices: [],
  setPaidInvoices: (paidInvoices: Invoice[]) => set({ paidInvoices }),
  activeProjects: [],
  setActiveProjects: (activeProjects: Project[]) => set({ activeProjects }),
}));
