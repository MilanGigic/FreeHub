"use client";

import { useInvoiceStore } from "@/lib/store/useInvoiceStore";

export default function InvoiceHeader() {
  const { outstandingInvoices, overdueInvoices, paidInvoices, invoices } =
    useInvoiceStore();

  return (
    <header className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          Outstanding Invoices
        </h1>
        <p className="text-2xl font-bold primary-amber flex items-center gap-2">
          ${outstandingInvoices}{" "}
          <span className="text-sm primary-slate">
            - including overdue invoices
          </span>
        </p>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          Overdue Invoices
        </h1>
        <p className="text-2xl font-bold primary-red flex items-center gap-2">
          ${overdueInvoices.data}
          <span className="text-sm primary-slate">
            - {overdueInvoices.count} invoice
            {overdueInvoices.count > 1 ? "s" : ""} overdue
          </span>
        </p>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          Total Paid
        </h1>
        <p className="text-2xl font-bold primary-green">${paidInvoices}</p>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          Average Days to Pay
        </h1>
        <p className="text-2xl font-bold primary-cyan">
          {invoices.length > 0
            ? Math.floor(
                invoices.reduce(
                  (acc, invoice) =>
                    acc +
                    (invoice.status !== "paid"
                      ? (invoice.dueDate.getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                      : 0),
                  0,
                ) / invoices.length,
              )
            : "No invoices"}
        </p>
      </div>
    </header>
  );
}
