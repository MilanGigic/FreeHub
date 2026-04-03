"use server";

import { getFinancesSnapshot } from "@/actions/finances";
import { getTaxProfile } from "@/actions/taxProfile";
import FinancesClient from "@/components/Finances/FinancesClient";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getSession } from "@/lib/session";
import { eq, sql } from "drizzle-orm";
import { getTranslations } from "next-intl/server";

export default async function FinancesPage() {
  const session = await getSession();

  if (!session?.userId) {
    const t = await getTranslations("auth");
    return (
      <div className="text-center text-primary font-semibold">
        {t("mustBeLoggedIn")}
      </div>
    );
  }

  const [snapshot, profile] = await Promise.all([
    getFinancesSnapshot(),
    getTaxProfile(session.userId),
  ]);

  const currentBalance = await db
    .select({
      total: sql<number>`coalesce(sum(case when type = 'income' then amount else -amount end), 0)`,
    })
    .from(transactions)
    .where(eq(transactions.userId, session.userId))
    .then((res) => Number(res[0]?.total ?? 0));

  return (
    <FinancesClient
      snapshot={snapshot}
      profile={profile}
      currentBalance={currentBalance}
    />
  );
}
