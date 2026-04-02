"use client";

import useFetchAllClients from "@/components/Clients/hooks/(clients)/useFetchAllClients";
import Header from "@/components/Header";
import useFetchAllProjects from "@/components/Projects/hooks/useFetchAllProjects";
import Sidebar from "@/components/Sidebar";
import { TaxProvider } from "@/components/TaxProvider";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

function useBootstrapAppData(pathname: string) {
  // Place app-wide data fetching and side-effect hooks here.
  // Dashboard now hydrates stores from a server payload; skip global bootstraps there
  // to avoid duplicate fetching and render storms.
  const shouldBootstrap = pathname !== "/dashboard";
  useFetchAllClients(shouldBootstrap);
  useFetchAllProjects(shouldBootstrap);
}

function MainLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  useBootstrapAppData(pathname);

  return (
    <TaxProvider>
      <div className="w-full min-h-screen h-full flex flex-col background relative">
        <Header />
        <div className="w-full flex items-stretch flex-1">
          <div className="sticky top-16 h-[calc(100vh-4rem)] z-20">
            <Sidebar />
          </div>
          <main className="flex-1 md:p-4">{children}</main>
        </div>
      </div>
    </TaxProvider>
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
