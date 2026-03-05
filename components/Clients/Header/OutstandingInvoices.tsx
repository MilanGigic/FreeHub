"use client";

import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import useCalculateAllOutstandingInvoices from "../hooks/(invoices)/useCalculateAllOutstandingInvoices";

export default function OutstandingInvoices() {
  const { allOutstandingInvoices } = useInvoiceStore();
  useCalculateAllOutstandingInvoices();
  return (
    <div className="background-elevated border background-border rounded-lg p-4">
      <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
        Outstanding Invoices
      </h1>
      <p className="text-2xl font-bold flex items-center gap-2 primary-amber">
        ${allOutstandingInvoices.data}
        <span className="text-sm primary-slate">
          - {allOutstandingInvoices.count} invoices outstanding
        </span>
      </p>
    </div>
  );
}
