"use client";

import { useEffect, useRef } from "react";
import { useClientStore } from "@/lib/store/useClientStore";
import { useDataStore } from "@/lib/store/useDataStore";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { Client, Project } from "@/types/types";

type DashboardHydrationPayload = {
  clients: Client[];
  projects: Project[];
  activeProjects: Project[];
  allOutstandingInvoices: { data: string; count: number };
  allOverdueInvoices: { data: string; count: number };
};

export default function DashboardHydrator({
  payload,
}: {
  payload: DashboardHydrationPayload;
}) {
  const didHydrate = useRef(false);

  useEffect(() => {
    if (didHydrate.current) return;
    didHydrate.current = true;

    useClientStore.getState().setClients(payload.clients);
    useDataStore.getState().setProjects(payload.projects);
    useProjectStore.getState().setActiveProjects(payload.activeProjects);

    useInvoiceStore
      .getState()
      .setAllOutstandingInvoices(payload.allOutstandingInvoices);
    useInvoiceStore.getState().setAllOverdueInvoices(payload.allOverdueInvoices);

    // Helpful baseline for finance UIs that use the "balance" field.
    const totalProfit = payload.projects.reduce(
      (acc, p) => acc + Number(p.totalProfit || 0),
      0,
    );
    useDataStore.getState().setBalance(totalProfit.toFixed(2));
  }, [payload]);

  return null;
}

