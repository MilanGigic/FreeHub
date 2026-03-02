"use client";

import InvoicesTable from "@/components/Clients/ClientPage/Invoices/InvoicesTable";
import useFetchAllInvoices from "@/components/Clients/hooks/useFetchAllInvoices";
import useFetchClient from "@/components/Clients/hooks/useFetchClient";
import useCalculateOutstandingInvoices from "@/components/Clients/hooks/useCalculateOutstandingInvoices";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useCalculateOverdueInvoices from "@/components/Clients/hooks/useCalculateOverdueInvoices";
import NewInvoiceForm from "@/components/Clients/ClientPage/Invoices/NewInvoiceForm";
import InvoiceHeader from "@/components/Clients/ClientPage/Invoices/InvoiceHeader";
import DraftedInvoices from "@/components/Clients/ClientPage/Invoices/DraftedInvoices";
import useCalculatePaidInvoices from "@/components/Clients/hooks/useCalculatePaidInvoices";

export default function InvoicesPage() {
  const pathname = usePathname();
  const clientId = pathname.split("/").pop();
  console.log("Client name:", clientId);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useFetchClient(setIsLoading);
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

      <div className="flex justify-center w-full h-full gap-2 md:gap-4">
        <NewInvoiceForm />

        <DraftedInvoices />
      </div>

      <InvoicesTable />
    </div>
  );
}
