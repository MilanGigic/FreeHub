"use client";

import { useClientStore } from "@/lib/store/useClientStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const tableLists = [
  "Client Name",
  "Status",
  "Revenue (MTD)",
  "Revenue (YTD)",
  "Outstanding",
  "Avg Payment Time",
  "Profitability %",
  "Last Payment Date",
  "Safe-to-Spend Contribution",
];

const maxMobileClients = 5;

export default function ClientTable() {
  const router = useRouter();

  const { clients, setSelectedClient } = useClientStore();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const currentClients = useMemo(() => {
    return clients.slice(
      (currentPage - 1) * maxMobileClients,
      currentPage * maxMobileClients,
    );
  }, [currentPage, clients]);

  const totalPages = useMemo(() => {
    return Math.ceil(clients.length / maxMobileClients);
  }, [clients]);

  return (
    <>
      {/* Mobile: card layout */}
      <div className="md:hidden space-y-3">
        <div className="flex w-64 mx-auto justify-between items-center">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="primary-slate hover:cursor-pointer disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-primary">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-secondary hover:cursor-pointer disabled:opacity-50"
          >
            Next
          </button>
        </div>
        {currentClients.map((client) => (
          <div
            key={client.id}
            className="rounded-lg border background-border background-elevated p-4"
          >
            <Link
              href={`/clients/${client.id}`}
              className="hover:cursor-pointer"
            >
              <div className="text-primary font-medium text-base mb-3 border-b background-border pb-2">
                {client.firstName} {client.lastName}
              </div>
              <dl className="grid gap-2">
                {tableLists.slice(1).map((label) => {
                  return (
                    <div
                      key={label}
                      className="flex justify-between items-center text-sm"
                    >
                      <dt className="text-primary">{label}</dt>
                    </div>
                  );
                })}
              </dl>
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="flex w-64 mx-auto justify-between items-center">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-primary hover:cursor-pointer disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-primary">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-primary hover:cursor-pointer disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              {tableLists.map((list) => (
                <th
                  key={list}
                  className="text-sm text-primary text-center whitespace-nowrap px-2 py-3"
                >
                  {list}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="max-h-[500px] overflow-y-auto">
            {/* TODO: Add input search and filter */}
            {currentClients.map((client) => (
              <tr
                key={client.id}
                className="border-t background-border hover:bg-(--bg-elevated)"
                onClick={() => {
                  setSelectedClient(client);
                  router.push(`/clients/${client.id}/overview`);
                }}
              >
                <td className="text-sm text-primary text-center px-2 py-3 hover:cursor-pointer">
                  {client.firstName} {client.lastName}
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  {client.status}
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  To be added
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  To be added
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  To be added
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  To be added
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  To be added
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  To be added
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  To be added
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

{
  /*
Client Name	Bold text, maybe client logo/icon optional
Status	Badge (green / yellow / red)
Revenue (MTD)	Number, teal if up, muted if flat
Revenue (YTD)	Number
Outstanding	Red if overdue, gray if pending
Avg Payment Time	Number + small trend arrow
Profitability %	Number, maybe progress bar
Last Payment Date	Date, formatted “MMM DD”
Safe-to-Spend Contribution	Number, small subtext: “% of buffer”  
  
*/
}
