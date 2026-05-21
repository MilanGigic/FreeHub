"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types/types";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { getColumns } from "@/components/Finances/Main/Transactions/TransactionsTable/columns";
import { useEffect, useMemo, useState } from "react";
import { useTransactionsFiltersStore } from "@/lib/store/useTransactionsFiltersStore";
import { useTranslations } from "next-intl";
import { getPresetRange } from "@/components/Wizard/SRB/steps/4/helpers";

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

    setColumnFilters(nextFilters);
  }, [filters]);

  return (
    <Table className="text-primary">
      <TableCaption>A list of your transactions.</TableCaption>

      {/* {isLoading && } */}

      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => {
              const canSort = header.column.getCanSort();
              return (
                <TableHead
                  key={header.id}
                  className={`w-[180px] uppercase tracking-wider ${header && header.column.columnDef.header === "Type" ? "text-start" : "text-center"}`}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={`flex items-center justify-center gap-2 select-none ${
                        canSort ? "cursor-pointer" : "cursor-default"
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}

                      {{
                        asc: "↑",
                        desc: "↓",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} className="text-center">
            {row.getVisibleCells().map((cell) => {
              const value = flexRender(
                cell.column.columnDef.cell,
                cell.getContext(),
              );
              console.log(
                flexRender(cell.column.columnDef.cell, cell.getContext()),
              );
              return <TableCell key={cell.id}>{value}</TableCell>;
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
