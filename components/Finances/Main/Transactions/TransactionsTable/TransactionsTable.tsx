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
import { useMemo, useState } from "react";
import { useTransactionsFiltersStore } from "@/lib/store/useTransactionsFiltersStore";
import { useTranslations } from "next-intl";
import useBuildColumnFilters from "@/lib/transactions/useBuildColumnFilters";

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
    <Table className="text-primary background-elevated border background-border">
      <TableCaption>A list of your transactions.</TableCaption>

      {/* {isLoading && } */}

      <TableHeader className="">
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
          <TableRow key={row.id} className="text-center hover:bg-white/15">
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
