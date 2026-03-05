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
import { fetchClientsProjects } from "@/actions/clients/fetchClientsProjects";
import { useEffect } from "react";
import useFetchAllInvoices from "@/components/Clients/hooks/(invoices)/useFetchAllInvoices";
import useCalculateOutstandingInvoices from "../../hooks/(invoices)/useCalculateOutstandingInvoices";
import useCalculateOverdueInvoices from "../../hooks/(invoices)/useCalculateOverdueInvoices";

export default function OverviewClient() {
  const { setClientProjects, selectedClient } = useClientStore();

  // Ensure invoices are loaded for this client so overview components can use real data
  useFetchAllInvoices();
  useCalculateOutstandingInvoices();
  useCalculateOverdueInvoices();

  useEffect(() => {
    (async () => {
      if (!selectedClient) {
        return;
      }

      const res = await fetchClientsProjects(selectedClient.id);
      if (res.success) {
        if (res.data) {
          setClientProjects(res.data);
        }
      }
    })();
  }, [selectedClient, setClientProjects]);
  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full h-full">
      <header className="text-sm primary-slate font-semibold text-center">
        Status:{" "}
        <span className="primary-green uppercase font-semibold">Active</span>
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
