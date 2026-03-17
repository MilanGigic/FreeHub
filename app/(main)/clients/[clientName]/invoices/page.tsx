"use client";

import InvoicesTable from "@/components/Clients/ClientPage/Invoices/InvoicesTable";
import NewInvoiceForm from "@/components/Clients/ClientPage/Invoices/NewInvoiceForm";
import InvoiceHeader from "@/components/Clients/ClientPage/Invoices/InvoiceHeader";
import DraftedInvoices from "@/components/Clients/ClientPage/Invoices/DraftedInvoices";

export default function InvoicesPage() {
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
