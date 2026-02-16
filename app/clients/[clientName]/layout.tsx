"use client";

import ClientPageHeader from "@/components/Clients/ClientPage/ClientPageHeader";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const clientName = pathname.split("/")[2];
  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full">
      <h1 className="text-2xl font-bold text-secondary uppercase text-center">
        {clientName.replace("-", " ")}
      </h1>
      <header>
        <ClientPageHeader clientName={clientName.replace("-", " ")} />
      </header>
      <main className="w-full">{children}</main>
    </div>
  );
}
