"use client";

import useFetchAllClients from "@/components/Clients/hooks/(clients)/useFetchAllClients";
import DashboardSkeleton from "@/components/Dashboard/DashboardSkeleton";
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
      <div className="w-full min-h-screen h-full flex flex-col relative bg-[#0A0A0B]">
        <Header />
        <div className="w-full flex items-stretch flex-1 min-w-0">
          <div className="sticky top-16 h-[calc(100vh-4rem)] z-20 shrink-0">
            <Sidebar />
          </div>
          <main className="min-w-0 flex-1 mx-2 my-2 sm:mx-4 sm:my-4 lg:m-8 md:p-4 rounded-lg bg-[#02070E]">
            {children}
          </main>
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
    <Suspense fallback={<DashboardSkeleton />}>
      <MainLayoutContent>{children}</MainLayoutContent>
    </Suspense>
  );
}
