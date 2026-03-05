"use client";

import useFetchAllClients from "@/components/Clients/hooks/(clients)/useFetchAllClients";
import useFetchAllInvoices from "@/components/Clients/hooks/(invoices)/useFetchAllInvoices";
import Header from "@/components/Header";
import useFetchAllProjects from "@/components/Projects/hooks/useFetchAllProjects";
import Sidebar from "@/components/Sidebar";
import Wizard from "@/components/Wizard/Wizard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function useBootstrapAppData() {
  // Place app-wide data fetching and side-effect hooks here.
  useFetchAllClients();
  useFetchAllProjects();
  useFetchAllInvoices();
}

function MainLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const isWizard = searchParams.get("wizard") === "true";
  useBootstrapAppData();

  return (
    <div className="w-full min-h-screen h-full flex flex-col background relative">
      {isWizard ? <Wizard /> : null}
      <Header />
      <div className="w-full flex items-stretch flex-1">
        <div className="sticky top-16 h-[calc(100vh-4rem)] z-20">
          <Sidebar />
        </div>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen h-full flex flex-col background relative">
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--accent-green)" />
          </div>
        </div>
      }
    >
      <MainLayoutContent>{children}</MainLayoutContent>
    </Suspense>
  );
}
