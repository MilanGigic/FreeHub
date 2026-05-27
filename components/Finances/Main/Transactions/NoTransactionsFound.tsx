"use client";

import { useState } from "react";
import AddTransactionModal from "@/components/Projects/AddTransactionModal";
import { useTranslations } from "next-intl";

export default function NoTransactionsFound() {
  const [openTransactionModal, setOpenTransactionModal] =
    useState<boolean>(false);

  const t = useTranslations("transactions");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4">
      <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-4 border-b-2 border-white">
        <h1 className="text-primary uppercase text-lg tracking-wider">
          Track your business finances in one place.
        </h1>
        <p className="primary-slate tracking-wide">
          Add your first transaction to begin generating cash flow insights, tax
          estimates, and profitability analytics.
        </p>
      </div>
    </div>
  );
}
