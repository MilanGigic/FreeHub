"use client";

import InvoicesTable from "@/components/Clients/ClientPage/Invoices/InvoicesTable";
import useFetchAllInvoices from "@/components/Clients/hooks/(invoices)/useFetchAllInvoices";
import useCalculateOutstandingInvoices from "@/components/Clients/hooks/(invoices)/useCalculateOutstandingInvoices";
import { useState } from "react";
import useCalculateOverdueInvoices from "@/components/Clients/hooks/(invoices)/useCalculateOverdueInvoices";
import NewInvoiceForm from "@/components/Clients/ClientPage/Invoices/NewInvoiceForm";
import InvoiceHeader from "@/components/Clients/ClientPage/Invoices/InvoiceHeader";
import DraftedInvoices from "@/components/Clients/ClientPage/Invoices/DraftedInvoices";
import useCalculatePaidInvoices from "@/components/Clients/hooks/(invoices)/useCalculatePaidInvoices";
import { useClientStore } from "@/lib/store/useClientStore";

export default function InvoicesPage() {
  const { selectedClient } = useClientStore();
  console.log("selectedClient", selectedClient);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useFetchAllInvoices();
  useCalculateOutstandingInvoices();
  useCalculateOverdueInvoices();
  useCalculatePaidInvoices();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--accent-green)" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4">
      <InvoiceHeader />

      <div className="flex flex-col md:flex-row justify-center w-full h-full gap-2 md:gap-4">
        <NewInvoiceForm />

        <DraftedInvoices />
      </div>

      <InvoicesTable />
    </div>
  );
}
