"use client";

import { fetchClient } from "@/actions/clients/fetchClient";
import ClientPageHeader from "@/components/Clients/ClientPage/ClientPageHeader";
import { useClientStore } from "@/lib/store/useClientStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedClient, setSelectedClient } = useClientStore();
  const pathname = usePathname();

  const clientSegments = pathname.split("/");
  const clientId = clientSegments[2];

  useEffect(() => {
    if (!clientId) return;
    (async () => {
      const res = await fetchClient(clientId);
      if (res.success) {
        if (res.data) {
          setSelectedClient(res.data);
        }
      }
    })();
  }, [clientId, setSelectedClient]);

  if (!selectedClient) {
    return (
      <div className="flex flex-col gap-2 md:gap-4 w-full items-center justify-center min-h-[200px] text-primary">
        Loading client...
      </div>
    );
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
