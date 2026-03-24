"use client";

import TotalRevenue from "./TotalRevenue";
import RevenueTrendGraph from "./RevenueTrendGraph";
import PaymentReliabilityScore from "./PaymentReliabilityScore";
import OutstandingInvoices from "./OutstandingInvoices";
import ProfitMargin from "./ProfitMargin";
import TaxReservedFromThisClient from "./TaxReservedFromThisClient";
import ProjectBreakdown from "./ProjectBreakdown";
import NetTakeHomeFromThisClient from "./NetTakeHomeFromThisClient";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { useClientStore } from "@/lib/store/useClientStore";

export default function OverviewClient() {
  const router = useRouter();

  const { selectedClient } = useClientStore();

  const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full h-full">
      <div className="flex w-full p-2 background-elevated gap-2">
        <button
          className="flex items-center gap-2 text-gray-500 uppercase font-semibold hover:text-(--accent-slate) transition-all cursor-pointer"
          onClick={(e) => handleBack(e)}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="h-full border background-border" />
        <Link
          href={"/clients"}
          className="text-gray-500 uppercase font-semibold hover:text-(--accent-slate) transition-all"
        >
          Clients
        </Link>
        <div className="h-full border background-border" />
        <h1 className="text-primary uppercase font-semibold">
          {selectedClient?.firstName} {selectedClient?.lastName}
        </h1>
      </div>
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
