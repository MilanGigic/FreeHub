"use client";

import { fetchClient } from "@/actions/clients/fetchClient";
import ClientPageHeader from "@/components/Clients/ClientPage/ClientPageHeader";
import { useClientStore } from "@/lib/store/useClientStore";
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedClientId, setSelectedClient, selectedClient } =
    useClientStore();

  useEffect(() => {
    (async () => {
      if (!selectedClientId) {
        return;
      }

      const res = await fetchClient(selectedClientId);
      if (res.success) {
        if (res.data) {
          setSelectedClient(res.data);
        }
      }
    })();
  }, [selectedClientId, setSelectedClient]);

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
