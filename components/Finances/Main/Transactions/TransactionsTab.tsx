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
import { Input } from "@/components/ui/input";
import { useDataStore } from "@/lib/store/useDataStore";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { fetchAllTransactions } from "@/actions/finances/fetchAllTransactons";
import AddTransactionModal from "@/components/Projects/AddTransactionModal";
import { useTranslations } from "next-intl";

export default function TransactionsTab() {
  const t = useTranslations("transactions");
  const { user } = useAuth();
  const { transactions, setTransactions, projects } = useDataStore();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openTransactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!user) return;
      setIsLoading(true);

      const res = await fetchAllTransactions(user.id);

      if (res.success) {
        const data = res.data;
        setTransactions(data);
        setIsLoading(false);
      } else {
        setError(res.message);
        setIsLoading(false);
      }
    })();
  }, [user, setTransactions]);

  useEffect(() => {}, []);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-primary text-3xl font-bold">{error}</p>
      </div>
    );
  }

  if (isLoading) {
  }

  return (
    <div className="w-full h-full flex">
      <div className="w-full h-full flex flex-col">
        {/* HEADER */}
        <div className="relative">
          <Input className="text-primary border background-border rounded-2xl" />
          <div className="absolute primary-slate top-1/2 -translate-y-1/2 right-4 flex gap-4">
            {/* FILTERS */}
            <p className="px-4 border rounded-2xl text-xl">1</p>
            <p className="px-4 border rounded-2xl text-xl">2</p>
            <p className="px-4 border rounded-2xl text-xl">3</p>
          </div>
        </div>

        {transactions.length > 0 ? (
          <Table className="text-primary">
            <TableCaption>A list of your transactions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="">Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="">Deductible</TableHead>
                <TableHead className="">Date</TableHead>
                <TableHead className="">Note</TableHead>
                <TableHead className="">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* FILL OUT THIS TABLE WITH REAL DATA */}

              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium flex items-center gap-1">
                    {t.type === "income" ? (
                      <div className="w-2 h-2 rounded-full bg-(--accent-green) animate-pulse duration-2000" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-(--accent-red) animate-pulse duration-2000" />
                    )}
                    <h1 className="uppercase tracking-tight">{t.type}</h1>
                  </TableCell>
                  <TableCell>{Number(t.amount).toLocaleString()}RSD</TableCell>
                  <TableCell>{t.projectName}</TableCell>
                  <TableCell>{t.deductible ? t.deductible : "No"}</TableCell>
                  <TableCell>
                    {t.transactionDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{t.note}</TableCell>
                  <TableCell>actions</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4">
            <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4 border-b-2 border-white">
              <h1 className="text-primary uppercase text-lg tracking-wider">
                Track your business finances in one place.
              </h1>
              <p className="primary-slate tracking-wide">
                Add your first transaction to begin generating cash flow
                insights, tax estimates, and profitability analytics.
              </p>

              <button
                onClick={() => setOpenTransactionModal(true)}
                className={`text-primary uppercase tracking-wide font-bold p-4 border rounded-2xl 
                ${openTransactionModal ? "bg-(--accent-green)/40" : "bg-(--accent-green)/20 border-(--accent-green) hover:bg-(--accent-green)/40"}
                transition-all duration-300`}
              >
                {t("addTransactionButton")}
              </button>
            </div>

            <div className="relative w-2xl h-full">
              {openTransactionModal && (
                <AddTransactionModal
                  onClose={() => setOpenTransactionModal(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
