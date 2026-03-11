import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import FinanceHeader from "@/components/Finances/FinanceHeader";
import FinanceMain from "@/components/Finances/Main/FinanceMain";
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
