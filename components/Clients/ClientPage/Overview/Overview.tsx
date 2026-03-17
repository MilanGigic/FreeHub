"use client";

import TotalRevenue from "./TotalRevenue";
import RevenueTrendGraph from "./RevenueTrendGraph";
import PaymentReliabilityScore from "./PaymentReliabilityScore";
import OutstandingInvoices from "./OutstandingInvoices";
import ProfitMargin from "./ProfitMargin";
import TaxReservedFromThisClient from "./TaxReservedFromThisClient";
import ProjectBreakdown from "./ProjectBreakdown";
import NetTakeHomeFromThisClient from "./NetTakeHomeFromThisClient";
import { useClientStore } from "@/lib/store/useClientStore";

export default function OverviewClient() {
  const { selectedClient } = useClientStore();
  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full h-full">
      <header className="text-sm primary-slate font-semibold text-center">
        Status:{" "}
        <span
          className={`uppercase font-semibold ${
            selectedClient?.status === "active"
              ? "primary-green"
              : selectedClient?.status === "paused"
                ? "primary-amber"
                : selectedClient?.status === "archived"
                  ? "primary-red"
                  : "primary-slate"
          }`}
        >
          {selectedClient?.status ?? "—"}
        </span>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full h-full">
        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row w-full h-full gap-2 md:gap-4">
          <TotalRevenue />
          <NetTakeHomeFromThisClient />
        </div>
        <div className="col-span-1 md:col-span-2">
          <RevenueTrendGraph />
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row w-full gap-2 md:gap-4">
          <OutstandingInvoices />
          <PaymentReliabilityScore />
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row w-full gap-2 md:gap-4">
          <ProfitMargin />
          <TaxReservedFromThisClient />
        </div>
        <div className="col-span-1 md:col-span-2 flex w-full gap-2 md:gap-4">
          <ProjectBreakdown />
        </div>
      </main>
    </div>
  );
}

{
  /*
Overview

Total revenue

Revenue trend graph

Payment reliability score

Outstanding invoices

Profit margin

Project breakdown

Tax reserved from this client

Net take-home from this client  
*/
}
