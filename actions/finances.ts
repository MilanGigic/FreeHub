"use server";

import { db } from "@/db";
import { invoices, transactions } from "@/db/schema";
import { sql } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function getFinancesSnapshot() {
  const session = await getSession();

  if (!session?.userId) throw new Error("Unauthenticated");

  const userId = session.userId;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [annualIncome, annualExpenses, expectedIncome, recentExpenses] =
    await Promise.all([
      db
        .select({ total: sql<number>`coalesce(sum(amount), 0)` })
        .from(transactions)
        .where(
          sql`user_id = ${userId}
              AND type = 'income'
              AND created_at >= date_trunc('year', now())`,
        )
        .then((r) => r[0]),

      db
        .select({ total: sql<number>`coalesce(sum(amount), 0)` })
        .from(transactions)
        .where(
          sql`user_id = ${userId}
              AND type = 'expense'
              AND created_at >= date_trunc('year', now())`,
        )
        .then((r) => r[0]),

      db
        .select({ total: sql<number>`coalesce(sum(total_amount), 0)` })
        .from(invoices)
        .where(
          sql`user_id = ${userId}
            AND status <> 'paid'
            AND due_date >= now()
            AND due_date <= now() + interval '30 days'`,
        )
        .then((r) => r[0]),

      db
        .select({ total: sql<number>`coalesce(sum(amount), 0)` })
        .from(transactions)
        .where(
          sql`user_id = ${userId}
            AND type = 'expense'
            AND created_at >= ${sixtyDaysAgo}`,
        )
        .then((r) => r[0]),
    ]);

  return {
    annualNetProfit:
      Number(annualIncome.total) - Number(annualExpenses.total),
    expectedIncomeNext30Days: Number(expectedIncome.total),
    avgMonthlyExpenses: Number(recentExpenses.total) / 2,
  };
}
