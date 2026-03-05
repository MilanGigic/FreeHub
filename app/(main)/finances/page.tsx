"use client";

import useFetchAllClients from "@/components/Clients/hooks/(clients)/useFetchAllClients";
import FinanceHeader from "@/components/Finances/FinanceHeader";
import FinanceMain from "@/components/Finances/Main/FinanceMain";
import useFetchAllProjects from "@/components/Projects/hooks/useFetchAllProjects";
import { useAuth } from "@/lib/useAuth";
import Link from "next/link";

export default function FinancesPage() {
  const { user, loading } = useAuth();

  useFetchAllClients();
  useFetchAllProjects();

  if (loading)
    return (
      <div className="text-center text-primary font-semibold">Loading...</div>
    );
  if (!user)
    return (
      <div className="text-center text-primary font-semibold">
        You must be logged in to access this page
        <div className="flex items-center gap-2 justify-center flex-wrap">
          <Link
            href="/login"
            className="primary-cyan hover:opacity-80 transition-all underline"
          >
            Login
          </Link>
          <span className="text-tertiary">or</span>
          <Link
            href="/register"
            className="primary-cyan hover:opacity-80 transition-all underline"
          >
            Register
          </Link>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full">
      <header>
        <FinanceHeader />
      </header>

      <main className="w-full">
        <FinanceMain />
      </main>
    </div>
  );
}
