"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/types/types";
import { useTranslations } from "next-intl";
import { getCurrencySymbol } from "@/lib/getCurrencySymbol";

export const getColumns = (
  tCategories: ReturnType<typeof useTranslations>,
): ColumnDef<Transaction>[] => [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;

      return (
        <div className="font-medium flex items-center justify-center gap-1">
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
      <span>
        {Number(row.original.amount).toLocaleString()}{" "}
        {getCurrencySymbol(row.original.currency)}
      </span>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "projectName",
    header: "Project",
    cell: ({ row }) => (
      <span
        className={`${row.original.projectName ? "" : "primary-slate italic uppercase"}`}
      >
        {row.original.projectName ?? "General"}
      </span>
    ),
    filterFn: (row, columnId, value) => {
      const cellValue = row.getValue(columnId);

      if (!cellValue) return false;

      return String(cellValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    },
  },
  {
    accessorKey: "clientName",
    header: "Client",
    cell: ({ row }) => (
      <span
        className={`${row.original.clientName ? "" : "primary-slate italic uppercase"}`}
      >
        {row.original.clientName ?? "General"}
      </span>
    ),
    filterFn: (row, columnId, value) => {
      const cellValue = row.getValue(columnId);

      if (!cellValue) return false;

      return String(cellValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    },
  },

  {
    accessorKey: "deductible",
    header: "Deductible",

    filterFn: (row, columnId, value) => {
      if (!value) return true;

      return row.getValue(columnId) === true;
    },

    cell: ({ row }) => (row.original.deductible ? "Yes" : "No"),
  },
  {
    accessorKey: "isRecurring",
    header: "Recurring",

    filterFn: (row, columnId, value) => {
      if (!value) return true;

      return row.getValue(columnId) === true;
    },

    cell: ({ row }) => (row.original.isRecurring ? "Yes" : "No"),
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
    enableSorting: false,
    filterFn: (row, columnId, value) => {
      const cellValue = row.getValue(columnId);

      if (!cellValue) return false;

      return String(cellValue)
        .toLowerCase()
        .includes(String(value).toLowerCase());
    },
  },
];
