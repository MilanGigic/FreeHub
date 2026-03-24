"use client";

import ClientsHeader from "@/components/Clients/Header/ClientsHeader";
import ClientsMain from "@/components/Clients/ClientsMain";

export const dynamic = "force-dynamic";

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full min-h-screen h-full">
      <header>
        <ClientsHeader />
      </header>
      <main className="w-full">
        <ClientsMain />
      </main>
    </div>
  );
}
