import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import FinancesHero from "@/components/Finances/FinancesHero";
import CashFlow from "@/components/Finances/Main/CashFlow";
import GoalsCardClient from "@/components/Finances/Main/GoalsCardClient";
import ProjectProfitability from "@/components/Finances/Main/ProjectProfitability";
import RecentTransactions from "@/components/Finances/Main/RecentTransactions";
import TransactionSimulator from "@/components/Finances/Main/TransactionSimulator";
import Link from "next/link";

export default async function FinancesPage() {
  const user = await getCurrentUser();

  if (!user)
    return (
      <div className="text-center text-primary font-semibold">
        You must be logged in to access this page
      </div>
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
    // <div className="flex flex-col gap-2 md:gap-4 w-full">
    <div className="w-full min-h-screen background p-6 flex flex-col gap-6">
      <FinancesHero />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Cash Flow chart — primary visual */}
          <CashFlow />

          {/* Zone 3: Project profitability — detail on demand */}
          <ProjectProfitability />
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-6">
          {/* Recent transactions — live feed */}
          <RecentTransactions />

          {/* Savings goals */}
          <GoalsCardClient />

          {/* Cash flow simulator */}
          <TransactionSimulator />
        </div>
      </div>
      {/* <header>
        <FinanceHeader />
      </header>

      <main className="w-full">
        <FinanceMain />
      </main> */}
    </div>
  );
}
