"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/types/types";
import { useTranslations } from "next-intl";

export const getColumns = (
  tCategories: ReturnType<typeof useTranslations>,
): ColumnDef<Transaction>[] => [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;

      return (
        <div className="font-medium flex items-center gap-1">
          {type === "income" ? (
            <div className="w-2 h-2 rounded-full bg-(--accent-green)" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-(--accent-red)" />
          )}

          <span className="uppercase tracking-tight">{type}</span>
        </div>
      );
    },
    enableSorting: true,
  },

  {
    accessorKey: "category",
    header: "Category",
    enableSorting: true,
    cell: ({ row }) => <span>{tCategories(row.original.category)}</span>,
  },

  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span>{Number(row.original.amount).toLocaleString()} RSD</span>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "projectName",
    header: "Project",
  },

  {
    accessorKey: "deductible",
    header: "Deductible",
    cell: ({ row }) => (row.original.deductible ? "Yes" : "No"),
    enableSorting: true,
  },

  {
    accessorKey: "transactionDate",
    header: "Date",

    cell: ({ row }) => {
      const date = new Date(row.original.transactionDate);

      return <span>{date.toLocaleDateString()}</span>;
    },

    filterFn: (row, columnId, value) => {
      const date = new Date(row.getValue(columnId));

      if (!value) return true;

      const { from, to } = value;

      if (from && date < from) return false;

      if (to && date > to) return false;

      return true;
    },
  },

  {
    accessorKey: "note",
    header: "Note",
    enableSorting: false,
  },
];
