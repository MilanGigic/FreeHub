"use client";

import { Transaction } from "@/types/types";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { getColumns } from "@/components/Finances/Main/Transactions/TransactionsTable/columns";
import { useMemo, useState } from "react";
import { useTransactionsFiltersStore } from "@/lib/store/useTransactionsFiltersStore";
import { useTranslations } from "next-intl";
import useBuildColumnFilters from "@/lib/transactions/useBuildColumnFilters";
import DesktopTable from "./DesktopTable";
import MobileCards from "./MobileCards";

type TransactionsTableProps = {
  transactions: Transaction[];
};

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const tCategories = useTranslations("transactions.categories");
  const { filters } = useTransactionsFiltersStore();
  const columns = useMemo(() => getColumns(tCategories), [tCategories]);
  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  useBuildColumnFilters({ filters, setColumnFilters });
  return (
    <div className="w-full h-full">
      {/* desktop */}
      <div className="hidden lg:block">
        <DesktopTable table={table} />
      </div>

      {/* mobile */}
      <div className="lg:hidden w-[300px]">
        <MobileCards table={table} />
      </div>
    </div>
  );
}
