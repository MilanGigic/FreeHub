"use client";

import { useClientStore } from "@/lib/store/useClientStore";

export default function InvoiceHeader() {
  const { outstandingInvoices, overdueInvoices } = useClientStore();

  return (
    <header className="flex gap-2 md:gap-4 justify-center">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          Outstanding Invoices
        </h1>
        <p className="text-2xl font-bold primary-amber">
          ${outstandingInvoices}
        </p>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          Overdue Invoices
        </h1>
        <p className="text-2xl font-bold primary-red flex items-center gap-2">
          ${overdueInvoices.data}
          <span className="text-sm primary-slate">
            - {overdueInvoices.count} invoices overdue
          </span>
        </p>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          Total Paid
        </h1>
        <p className="text-2xl font-bold primary-green">To be added...</p>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          Average Days to Pay
        </h1>
        <p className="text-2xl font-bold primary-cyan">To be added...</p>
      </div>
    </header>
  );
}
