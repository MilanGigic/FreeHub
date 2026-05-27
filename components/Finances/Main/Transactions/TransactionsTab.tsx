"use client";

import { useDataStore } from "@/lib/store/useDataStore";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { fetchAllTransactions } from "@/actions/finances/fetchAllTransactons";
import { Spinner } from "@/components/ui/spinner";
import NoTransactionsFound from "./NoTransactionsFound";
import TransactionsTable from "./TransactionsTable/TransactionsTable";
import TransactionsHeader from "./TransactionsHeader/TransactionsHeader";

export default function TransactionsTab() {
  const { user } = useAuth();
  const { transactions, setTransactions } = useDataStore();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-primary text-3xl font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex">
      <div className="w-full h-full flex flex-col gap-4">
        {/* HEADER */}
        <TransactionsHeader />

        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner className="text-(--accent-cyan) w-40 h-40" />
          </div>
        ) : !isLoading && transactions.length === 0 ? (
          <NoTransactionsFound />
        ) : transactions.length > 0 ? (
          <TransactionsTable transactions={transactions} />
        ) : null}
      </div>
    </div>
  );
}
