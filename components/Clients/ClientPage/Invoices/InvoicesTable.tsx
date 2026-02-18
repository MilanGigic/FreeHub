"use client";

import { useState } from "react";

const invoiceListHeaders = [
  "Invoice #",
  "Client",
  "Project",
  "Amount",
  "Status",
  "Issued",
  "Due",
  "Days to Pay",
];
const invoiceListData = [
  {
    invoiceNumber: "1234567890",
    client: "Client 1",
    project: "Project 1",
    amount: 1000,
    status: "Paid",
    issued: "12/12/2025",
    due: "12/12/2025",
    daysToPay: "Paid on time", // paid on time
  },
  {
    invoiceNumber: "1234567890",
    client: "Client 1",
    project: "Project 1",
    amount: 1000,
    status: "Pending",
    issued: "12/12/2025",
    due: "12/12/2025",
    daysToPay: "10 days late", // pending
  },
  {
    invoiceNumber: "1234567890",
    client: "Client 1",
    project: "Project 1",
    amount: 1000,
    status: "Overdue",
    issued: "12/12/2025",
    due: "12/12/2025",
    daysToPay: "2 days late", // overdue
  },
  {
    invoiceNumber: "1234567890",
    client: "Client 1",
    project: "Project 1",
    amount: 1000,
    status: "Draft",
    issued: null,
    due: null,
    daysToPay: "Draft", // draft
  },
];

export default function InvoicesTable() {
  const [show, setShow] = useState<
    "all" | "paid" | "pending" | "overdue" | "draft"
  >("all");

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-2 justify-center pb-4">
        <h1>Show:</h1>
        <button
          className={`${show === "all" ? "bg-[#2dd4bf]/20 text-[#2dd4bf]" : "primary-cyan"} border rounded-lg px-2 py-1 cursor-pointer hover:bg-[#2dd4bf]/20 hover:text-[#2dd4bf]`}
          onClick={() => setShow("all")}
        >
          All
        </button>
        <button
          className={`${show === "paid" ? "bg-[#34d399]/20 text-[#34d399]" : "primary-green"}  border rounded-lg px-2 py-1 cursor-pointer hover:bg-[#34d399]/20 hover:text-[#34d399]`}
          onClick={() => setShow("paid")}
        >
          Paid
        </button>
        <button
          className={`${show === "pending" ? "bg-[#d29922]/20 text-[#d29922]" : "primary-amber"}  border rounded-lg px-2 py-1 cursor-pointer hover:bg-[#d29922]/20 hover:text-[#d29922]`}
          onClick={() => setShow("pending")}
        >
          Pending
        </button>
        <button
          className={`${show === "overdue" ? "bg-[#f85149]/20 text-[#f85149]" : "primary-red"}  border rounded-lg px-2 py-1 cursor-pointer hover:bg-[#f85149]/20 hover:text-[#f85149]`}
          onClick={() => setShow("overdue")}
        >
          Overdue
        </button>
        <button
          className={`${show === "draft" ? "bg-[#64748b]/20 text-[#64748b]" : "primary-slate"}  border rounded-lg px-2 py-1 cursor-pointer hover:bg-[#64748b]/20 hover:text-[#64748b]`}
          onClick={() => setShow("draft")}
        >
          Draft
        </button>
      </div>
      <table className="w-full">
        <thead className="border-b border-[#21262d] background-elevated w-full">
          <tr>
            {invoiceListHeaders.map((header) => (
              <th
                key={header}
                className="text-sm text-secondary text-center whitespace-nowrap px-2 py-3"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="max-h-[500px] overflow-y-auto border-b border-[#21262d] background-elevated w-full">
          {invoiceListData.map((invoice, index) => (
            <tr
              key={index}
              className="border-b border-[#21262d] text-center text-secondary"
            >
              <td className="text-sm text-primary py-2">
                {invoice.invoiceNumber}
              </td>
              <td className="text-sm text-primary py-2">{invoice.client}</td>
              <td className="text-sm text-primary py-2">{invoice.project}</td>
              <td className="text-sm text-primary py-2">
                <span className="primary-cyan">${invoice.amount}</span>
              </td>
              <td
                className={`text-sm text-primary py-2 ${invoice.status === "Paid" ? "primary-green" : invoice.status === "Pending" ? "primary-amber" : "primary-red"}`}
              >
                <span
                  className={`${invoice.status === "Paid" ? "primary-green" : invoice.status === "Pending" ? "primary-amber" : invoice.status === "Draft" ? "primary-slate" : "primary-red"}`}
                >
                  {invoice.status}
                </span>
              </td>
              <td className="text-sm text-primary py-2">{invoice.issued}</td>
              <td className="text-sm text-primary py-2">{invoice.due}</td>
              <td className="text-sm text-primary py-2">
                <span
                  className={`${invoice.daysToPay === "Paid on time" ? "primary-green" : invoice.daysToPay === "10 days late" ? "primary-amber" : invoice.daysToPay === "2 days late" ? "primary-red" : "primary-slate"}`}
                >
                  {invoice.daysToPay}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
