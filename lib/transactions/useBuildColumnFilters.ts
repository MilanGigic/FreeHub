"use client";

import { useEffect } from "react";
import { TransactionFilters } from "../store/useTransactionsFiltersStore";
import { ColumnFiltersState } from "@tanstack/react-table";
import { getPresetRange } from "@/components/Wizard/SRB/steps/4/helpers";

type BuildColumnFiltersProps = {
  filters: TransactionFilters;
  setColumnFilters: (columnFilters: ColumnFiltersState) => void;
};

export default function useBuildColumnFilters({
  filters,
  setColumnFilters,
}: BuildColumnFiltersProps) {
  useEffect(() => {
    const nextFilters: ColumnFiltersState = [];

    if (filters.type) {
      nextFilters.push({
        id: "type",
        value: filters.type,
      });
    }

    if (filters.category) {
      nextFilters.push({
        id: "category",
        value: filters.category,
      });
    }

    if (filters.customDateRange) {
      nextFilters.push({
        id: "transactionDate",
        value: filters.customDateRange,
      });
    }

    if (filters.datePreset) {
      nextFilters.push({
        id: "transactionDate",
        value: getPresetRange(filters.datePreset),
      });
    }
    if (filters.projectName) {
      nextFilters.push({
        id: "projectName",
        value: filters.projectName,
      });
    }
    if (filters.clientName) {
      nextFilters.push({
        id: "clientName",
        value: filters.clientName,
      });
    }
    if (filters.minAmount) {
      nextFilters.push({
        id: "minAmount",
        value: filters.minAmount,
      });
    }
    if (filters.maxAmount) {
      nextFilters.push({
        id: "maxAmount",
        value: filters.maxAmount,
      });
    }

    if (filters.deductibleOnly) {
      nextFilters.push({
        id: "deductible",
        value: true,
      });
    }

    if (filters.recurringOnly) {
      nextFilters.push({
        id: "isRecurring",
        value: true,
      });
    }

    if (filters.hasNotesOnly) {
      nextFilters.push({
        id: "note",
        value: true,
      });
    }

    if (filters.search && filters.searchColumn) {
      nextFilters.push({
        id: filters.searchColumn,
        value: filters.search,
      });
    }

    setColumnFilters(nextFilters);
  }, [filters, setColumnFilters]);
}
