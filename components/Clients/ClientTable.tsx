"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const clientsData = [
  {
    name: "Client 1",
    status: "Active",
    revenueMTD: 1000,
    revenueYTD: 1000,
    outstanding: "Overdue",
    avgPaymentTime: 10,
    profitability: 10,
    lastPaymentDate: "2026-01-01",
    safeToSpendContribution: 10,
  },
  {
    name: "Client 2",
    status: "Inactive",
    revenueMTD: 1000,
    revenueYTD: 1000,
    outstanding: "Pending",
    avgPaymentTime: 10,
    profitability: 10,
    lastPaymentDate: "2026-01-01",
    safeToSpendContribution: 10,
  },
  {
    name: "Client 3",
    status: "Overdue",
    revenueMTD: 1000,
    revenueYTD: 1000,
    outstanding: "Overdue",
    avgPaymentTime: 10,
    profitability: 10,
    lastPaymentDate: "2026-01-01",
    safeToSpendContribution: 10,
  },
  {
    name: "Client 4",
    status: "Pending",
    revenueMTD: 1000,
    revenueYTD: 1000,
    outstanding: "Pending",
    avgPaymentTime: 10,
    profitability: 10,
    lastPaymentDate: "2026-01-01",
    safeToSpendContribution: 10,
  },
  {
    name: "Client 5",
    status: "Overdue",
    revenueMTD: 1000,
    revenueYTD: 1000,
    outstanding: "Overdue",
    avgPaymentTime: 10,
    profitability: 10,
    lastPaymentDate: "2026-01-01",
    safeToSpendContribution: 10,
  },
  {
    name: "Client 6",
    status: "Pending",
    revenueMTD: 1000,
    revenueYTD: 1000,
    outstanding: "Pending",
    avgPaymentTime: 10,
    profitability: 10,
    lastPaymentDate: "2026-01-01",
    safeToSpendContribution: 10,
  },
];

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

const clientKeys = [
  "name",
  "status",
  "revenueMTD",
  "revenueYTD",
  "outstanding",
  "avgPaymentTime",
  "profitability",
  "lastPaymentDate",
  "safeToSpendContribution",
] as const;

function getClientValue(
  client: (typeof clientsData)[number],
  key: (typeof clientKeys)[number],
) {
  return client[key];
}

const maxMobileClients = 5;

export default function ClientTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const currentClients = useMemo(() => {
    return clientsData.slice(
      (currentPage - 1) * maxMobileClients,
      currentPage * maxMobileClients,
    );
  }, [currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(clientsData.length / maxMobileClients);
  }, []);

  return (
    <>
      {/* Mobile: card layout */}
      <div className="md:hidden space-y-3">
        <div className="flex w-64 mx-auto justify-between items-center">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-secondary hover:cursor-pointer disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-secondary">
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
            key={client.name}
            className="rounded-lg border border-[#21262d] bg-[#161b22]/50 p-4"
          >
            <Link
              href={`/clients/${client.name.toLowerCase().replace(" ", "-").replace(".", "")}`}
              className="hover:cursor-pointer"
            >
              <div className="text-primary font-medium text-base mb-3 border-b border-[#21262d] pb-2">
                {client.name}
              </div>
              <dl className="grid gap-2">
                {tableLists.slice(1).map((label, i) => {
                  const key = clientKeys[i + 1];
                  return (
                    <div
                      key={label}
                      className="flex justify-between items-center text-sm"
                    >
                      <dt className="text-secondary">{label}</dt>
                      <dd className="text-primary font-mono">
                        {String(getClientValue(client, key))}
                      </dd>
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
            className="text-secondary hover:cursor-pointer disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-secondary">
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
        <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              {tableLists.map((list) => (
                <th
                  key={list}
                  className="text-sm text-secondary text-center whitespace-nowrap px-2 py-3"
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
                key={client.name}
                className="border-t border-[#21262d] hover:bg-[#161b22]/30"
              >
                <td className="text-sm text-primary text-center px-2 py-3 hover:cursor-pointer">
                  <Link
                    href={`/clients/${client.name
                      .toLowerCase()
                      .replace(" ", "-")
                      .replace(".", "")}`}
                  >
                    {client.name}
                  </Link>
                </td>
                <td className="text-sm text-secondary text-center px-2 py-3">
                  {client.status}
                </td>
                <td className="text-sm text-secondary text-center px-2 py-3">
                  {client.revenueMTD}
                </td>
                <td className="text-sm text-secondary text-center px-2 py-3">
                  {client.revenueYTD}
                </td>
                <td className="text-sm text-secondary text-center px-2 py-3">
                  {client.outstanding}
                </td>
                <td className="text-sm text-secondary text-center px-2 py-3">
                  {client.avgPaymentTime}
                </td>
                <td className="text-sm text-secondary text-center px-2 py-3">
                  {client.profitability}
                </td>
                <td className="text-sm text-secondary text-center px-2 py-3">
                  {client.lastPaymentDate}
                </td>
                <td className="text-sm text-secondary text-center px-2 py-3">
                  {client.safeToSpendContribution}
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
