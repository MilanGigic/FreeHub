"use client";

import FinanceHeader from "@/components/Finances/FinanceHeader";
import FinanceMain from "@/components/Finances/Main/FinanceMain";
import { useAuth } from "@/lib/useAuth";
import Link from "next/link";
// track income and expenses
// calculate taxes
// generate "Safe to spend" amount

export default function FinancesPage() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="text-center text-white font-semibold">Loading...</div>
    );
  if (!user)
    return (
      <div className="text-center text-white font-semibold">
        You must be logged in to access this page
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-[#2dd4bf] hover:text-[#2dd4bf]/60 transition-all underline"
          >
            Login
          </Link>
          <span className="text-gray-400">or</span>
          <Link
            href="/register"
            className="text-[#2dd4bf] hover:text-[#2dd4bf]/60 transition-all underline"
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
