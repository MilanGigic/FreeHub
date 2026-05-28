import { Transaction } from "@/types/types";
import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export default function MobileCards({ table }: { table: Table<Transaction> }) {
  const tCategory = useTranslations("transactions.categories");

  return (
    <div className="flex flex-col gap-4 w-full items-center justify-center">
      {table.getRowModel().rows.map((row) => {
        const tx = row.original;

        return (
          <div
            key={row.id}
            className="rounded-2xl border background-elevated p-4 w-full"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-primary">{tx.title}</h2>

              <span
                className={
                  tx.type === "income" ? "text-green-400" : "text-red-400"
                }
              >
                {tx.amount} RSD
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-1 text-sm text-zinc-400">
              <p>{tCategory(`${tx.category}`)}</p>
              <p>{tx.projectName ?? "No project"}</p>
              <p>{new Date(tx.transactionDate).toLocaleDateString()}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
