"use client";

import { useClientStore } from "@/lib/store/useClientStore";
import { Invoice } from "@/types/types";
import { useMemo, useState } from "react";

const invoiceListHeaders = [
  "Invoice #",
  "Client",
  "Amount",
  "Status",
  "Issued",
  "Due",
  "Days to Pay",
];

type StatusFilter = "all" | "paid" | "sent" | "overdue" | "draft";

function filterInvoices(invoices: Invoice[], show: StatusFilter): Invoice[] {
  if (show === "all") return invoices;
  if (show === "sent") return invoices.filter((inv) => inv.status === "sent");
  return invoices.filter((inv) => inv.status === show);
}

export default function InvoicesTable() {
  const { invoices, selectedClient } = useClientStore();

  const [show, setShow] = useState<StatusFilter>("all");

  const filteredInvoices = useMemo(
    () => filterInvoices(invoices, show),
    [invoices, show],
  );

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-2 justify-center pb-4">
        <h1>Show:</h1>
        <button
          className={`${show === "all" ? "bg-(--accent-cyan)/20 primary-cyan" : "primary-cyan"} border background-border rounded-lg px-2 py-1 cursor-pointer hover:bg-(--accent-cyan)/20 hover:primary-cyan`}
          onClick={() => setShow("all")}
        >
          All
        </button>
        <button
          className={`${show === "paid" ? "bg-(--accent-green)/20 primary-green" : "primary-green"} border background-border rounded-lg px-2 py-1 cursor-pointer hover:bg-(--accent-green)/20 hover:primary-green`}
          onClick={() => setShow("paid")}
        >
          Paid
        </button>
        <button
          className={`${show === "sent" ? "bg-(--accent-amber)/20 primary-amber" : "primary-amber"} border background-border rounded-lg px-2 py-1 cursor-pointer hover:bg-(--accent-amber)/20 hover:primary-amber`}
          onClick={() => setShow("sent")}
        >
          Sent
        </button>
        <button
          className={`${show === "overdue" ? "bg-(--accent-red)/20 primary-red" : "primary-red"} border background-border rounded-lg px-2 py-1 cursor-pointer hover:bg-(--accent-red)/20 hover:primary-red`}
          onClick={() => setShow("overdue")}
        >
          Overdue
        </button>
        <button
          className={`${show === "draft" ? "bg-(--accent-slate)/20 primary-slate" : "primary-slate"} border background-border rounded-lg px-2 py-1 cursor-pointer hover:bg-(--accent-slate)/20 hover:primary-slate`}
          onClick={() => setShow("draft")}
        >
          Draft
        </button>
      </div>
      <table className="w-full">
        <thead className="border-b background-border background-elevated w-full">
          <tr>
            {invoiceListHeaders.map((header) => (
              <th
                key={header}
                className="text-sm text-primary text-center whitespace-nowrap px-2 py-3"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="max-h-[500px] overflow-y-auto border-b background-border background-elevated w-full">
          {filteredInvoices.map((invoice, index) => (
            <tr key={index} className="border-b background-border text-center">
              <td className="text-sm text-primary py-2">{invoice.id}</td>
              <td className="text-sm text-primary py-2">
                {selectedClient?.firstName} {selectedClient?.lastName}
              </td>
              <td className="text-sm text-primary py-2">
                <span className="primary-cyan">${invoice.totalAmount}</span>
              </td>
              <td
                className={`text-sm text-primary py-2 ${invoice.status === "paid" ? "primary-green" : invoice.status === "sent" ? "primary-amber" : invoice.status === "overdue" ? "primary-red" : "primary-slate"}`}
              >
                <span
                  className={`${invoice.status === "paid" ? "primary-green" : invoice.status === "sent" ? "primary-amber" : invoice.status === "overdue" ? "primary-red" : "primary-slate"}`}
                >
                  {invoice.status}
                </span>
              </td>
              <td className="text-sm text-primary py-2">
                {invoice.issueDate.toLocaleDateString()}
              </td>
              <td className="text-sm text-primary py-2">
                {invoice.dueDate.toLocaleDateString()}
              </td>
              <td className="text-sm text-primary py-2">
                <span
                  className={`${invoice.paymentDate ? "primary-green" : invoice.paymentDate ? "primary-amber" : invoice.paymentDate ? "primary-red" : "primary-slate"}`}
                >
                  {invoice.dueDate < new Date()
                    ? Math.floor(
                        (invoice.dueDate.getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24),
                      )
                    : Math.floor(
                        (invoice.dueDate.getTime() -
                          invoice.issueDate.getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
