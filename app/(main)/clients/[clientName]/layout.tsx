"use client";

import { fetchClientOverviewData } from "@/actions/clients/fetchClientOverviewData";
import ClientPageHeader from "@/components/Clients/ClientPage/ClientPageHeader";
import ClientPageSkeleton from "@/components/Clients/ClientPage/ClientPageSkeleton";
import { useClientStore } from "@/lib/store/useClientStore";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedClient, setSelectedClient, setSelectedClientId } =
    useClientStore();
  const {
    setInvoices,
    setOutstandingInvoices,
    setOverdueInvoices,
    setPaidInvoices,
  } = useInvoiceStore();
  const pathname = usePathname();

  const clientSegments = pathname.split("/");
  const clientId = clientSegments[2];

  useEffect(() => {
    if (!clientId) return;
    // Set immediately so other hooks can fetch in parallel (avoid waterfall).
    setSelectedClientId(clientId);
    // Clear previous client data quickly to avoid stale flashes.
    setSelectedClient(null);
    setInvoices([]);
    setOutstandingInvoices("0.00");
    setOverdueInvoices({ data: "0.00", count: 0 });
    setPaidInvoices("0.00");
    (async () => {
      const res = await fetchClientOverviewData(clientId);
      if (!res.success) return;
      if (!res.data) return;

      setSelectedClient(res.data.client);
      // Projects are stored in client store, so set there.
      useClientStore.getState().setClientProjects(res.data.projects);

      setInvoices(res.data.invoices);
      setOutstandingInvoices(res.data.totals.outstandingInvoices);
      setOverdueInvoices({
        data: res.data.totals.overdueInvoices,
        count: res.data.totals.overdueCount,
      });
      setPaidInvoices(res.data.totals.paidInvoices);
    })();
  }, [
    clientId,
    setSelectedClient,
    setSelectedClientId,
    setOutstandingInvoices,
    setOverdueInvoices,
    setPaidInvoices,
    setInvoices,
  ]);

  if (!selectedClient) {
    return <ClientPageSkeleton />;
  }

  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full">
      <h1 className="text-3xl md:text-2xl font-bold text-primary uppercase text-center">
        {selectedClient.firstName} {selectedClient.lastName}
      </h1>
      <header>
        <ClientPageHeader clientId={selectedClient.id} />
      </header>
      <main className="w-full">{children}</main>
    </div>
  );
}
