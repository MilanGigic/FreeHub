"use client";

import { fetchClient } from "@/actions/clients/fetchClient";
import ClientPageHeader from "@/components/Clients/ClientPage/ClientPageHeader";
import { useClientStore } from "@/lib/store/useClientStore";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function getClientIdFromPathname(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  // pathname is /clients/<clientId>/... so clientId is segments[1]
  return segments[0] === "clients" && segments[1] ? segments[1] : null;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const clientIdFromUrl = getClientIdFromPathname(pathname);
  const {
    selectedClientId,
    setSelectedClientId,
    setSelectedClient,
    selectedClient,
  } = useClientStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const idToFetch = clientIdFromUrl ?? selectedClientId;
      if (!idToFetch) {
        setIsLoading(false);
        return;
      }

      // Sync store with URL so navigation from list still works
      if (clientIdFromUrl && clientIdFromUrl !== selectedClientId) {
        setSelectedClientId(clientIdFromUrl);
      }

      // If we already have the right client in store, no fetch
      if (selectedClient?.id === idToFetch) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const res = await fetchClient(idToFetch);
      setIsLoading(false);
      if (res.success && res.data) {
        setSelectedClient(res.data);
        setSelectedClientId(res.data.id);
      }
    })();
  }, [
    clientIdFromUrl,
    selectedClientId,
    selectedClient?.id,
    setSelectedClient,
    setSelectedClientId,
  ]);

  const hasClientId = Boolean(clientIdFromUrl ?? selectedClientId);
  if (hasClientId && !selectedClient) {
    return (
      <div className="flex flex-col gap-2 md:gap-4 w-full items-center justify-center min-h-[200px] text-primary">
        Loading client...
      </div>
    );
  }

  if (!selectedClient) return null;
  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full">
      <h1 className="text-2xl font-bold text-primary uppercase text-center">
        {selectedClient.firstName} {selectedClient.lastName}
      </h1>
      <header>
        <ClientPageHeader clientId={selectedClientId as string} />
      </header>
      <main className="w-full">{children}</main>
    </div>
  );
}
