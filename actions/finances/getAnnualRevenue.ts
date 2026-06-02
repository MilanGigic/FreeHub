"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getAnnualRevenue(userId: string) {
  return await db
    .select({
      total: sql<number>`coalesce(sum(case when type = 'income' then amount else -amount end), 0)`,
    })
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .then((res) => Number(res[0]?.total ?? 0));
}
