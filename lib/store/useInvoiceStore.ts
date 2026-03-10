import { Invoice } from "@/types/types";
import { create } from "zustand";

type InvoiceStore = {
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  outstandingInvoices: string;
  setOutstandingInvoices: (outstandingInvoices: string) => void;
  overdueInvoices: { data: string; count: number };
  setOverdueInvoices: (overdueInvoices: {
    data: string;
    count: number;
  }) => void;
  paidInvoices: string;
  setPaidInvoices: (paidInvoices: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  issueDate: Date;
  setIssueDate: (issueDate: Date) => void;
  dueDate: Date;
  setDueDate: (dueDate: Date) => void;
  averagePaymentTime: string;
  setAveragePaymentTime: (averagePaymentTime: string) => void;
  note: string;
  setNote: (note: string) => void;
  allOutstandingInvoices: { data: string; count: number };
  setAllOutstandingInvoices: (allOutstandingInvoices: {
    data: string;
    count: number;
  }) => void;
  allOverdueInvoices: { data: string; count: number };
  setAllOverdueInvoices: (allOverdueInvoices: {
    data: string;
    count: number;
  }) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (projectId: string | null) => void;
};

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  setInvoices: (invoices: Invoice[]) => set({ invoices }),
  outstandingInvoices: "",
  setOutstandingInvoices: (outstandingInvoices: string) =>
    set({ outstandingInvoices }),
  overdueInvoices: { data: "", count: 0 },
  setOverdueInvoices: (value: { data: string; count: number }) =>
    set({ overdueInvoices: value }),
  paidInvoices: "",
  setPaidInvoices: (paidInvoices: string) => set({ paidInvoices }),
  amount: "",
  setAmount: (amount: string) => set({ amount }),
  issueDate: new Date(),
  setIssueDate: (issueDate: Date) => set({ issueDate }),
  dueDate: new Date(),
  setDueDate: (dueDate: Date) => set({ dueDate }),
  averagePaymentTime: "",
  setAveragePaymentTime: (averagePaymentTime: string) =>
    set({ averagePaymentTime }),
  note: "",
  setNote: (note: string) => set({ note }),
  allOutstandingInvoices: { data: "", count: 0 },
  setAllOutstandingInvoices: (allOutstandingInvoices: {
    data: string;
    count: number;
  }) => set({ allOutstandingInvoices }),
  allOverdueInvoices: { data: "", count: 0 },
  setAllOverdueInvoices: (allOverdueInvoices: {
    data: string;
    count: number;
  }) => set({ allOverdueInvoices }),
  selectedProjectId: null,
  setSelectedProjectId: (projectId: string | null) =>
    set({ selectedProjectId: projectId }),
}));
