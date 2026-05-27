import { DateRange } from "react-day-picker";
import { create } from "zustand";

export type FiltersType = "all" | "income" | "expense";

export type DatePreset = "7d" | "30d" | "month" | "year";

type TransactionFilters = {
  search: string | null;
  type: FiltersType | null;
  category: string | null;

  deductibleOnly: boolean;
  recurringOnly: boolean;
  hasNotesOnly: boolean;

  projectName: string | null;
  clientName: string | null;

  minAmount: number | null;
  maxAmount: number | null;

  datePreset: DatePreset | null;
  customDateRange: DateRange | null;
};

type TransactionsFiltersStore = {
  filters: TransactionFilters;

  setFilters: (filters: Partial<TransactionFilters>) => void;

  resetFilters: () => void;
};

const initialFilters: TransactionFilters = {
  search: null,
  type: null,
  category: null,
  deductibleOnly: false,
  recurringOnly: false,
  hasNotesOnly: false,
  projectName: null,
  clientName: null,
  minAmount: null,
  maxAmount: null,
  datePreset: null,
  customDateRange: null,
};

export const useTransactionsFiltersStore = create<TransactionsFiltersStore>(
  (set) => ({
    filters: initialFilters,

    setFilters: (updates) =>
      set((state) => ({
        filters: {
          ...state.filters,
          ...updates,
        },
      })),

    resetFilters: () =>
      set({
        filters: initialFilters,
      }),
  }),
);
