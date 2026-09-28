"use client";

import InvoicesTable from "@/components/Clients/ClientPage/Invoices/InvoicesTable";
import InvoiceHeader from "@/components/Clients/ClientPage/Invoices/InvoiceHeader";

export default function InvoicesPage() {
  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4">
      <InvoiceHeader displayCurrency={"RSD"} />

      <InvoicesTable />
    </div>
  );
}
