"use server";

import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { getFinancesSnapshot } from "@/actions/finances";
import { getTaxProfile } from "@/actions/taxProfile";
import FinancesClient from "@/components/Finances/FinancesClient";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

import Link from "next/link";

export default async function FinancesPage() {
  const user = await getCurrentUser();

  if (!user)
    return (
      <div className="text-center text-primary font-semibold">
        You must be logged in to access this page
      </div>
    );

  const [snapshot, profile] = await Promise.all([
    getFinancesSnapshot(),
    getTaxProfile(),
  ]);

  const currentBalance = await db
    .select({
      total: sql<number>`coalesce(sum(case when type = 'income' then amount else -amount end), 0)`,
    })
    .from(transactions)
    .where(eq(transactions.userId, user.id))
    .then((res) => Number(res[0]?.total ?? 0));

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
    <FinancesClient
      snapshot={snapshot}
      profile={profile}
      currentBalance={currentBalance}
    />
  );
}
