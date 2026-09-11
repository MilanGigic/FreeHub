"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getCurrentQuarter, getQuarterRange } from "@/utils/getQuarterRange";
import { and, eq, gte, lte, sql } from "drizzle-orm";

export async function getDeductibleExpensesForPeriod(
  userId: string,
  period: "quarter" | "year",
  options?: { year?: number; quarter?: 1 | 2 | 3 | 4 },
) {
  if (!userId)
    throw new Error("[getDeductibleExpensesForPeriod]:: UserID required!");

  const now = new Date();
  const year = options?.year ?? now.getFullYear();
  const quarter = options?.quarter ?? getCurrentQuarter(now).quarter;

  let start: Date;
  let end: Date;

  if (period === "year") {
    start = new Date(year, 0, 1);
    end = new Date(year, 11, 31, 23, 59, 59);
  } else {
    const range = getQuarterRange(year, quarter);
    start = range.start;
    end = range.end;
  }

  const rows = await db
    .select({
      total: sql<string>`coalesce(sum(${transactions.amount}), 0)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.type, "expense"),
        eq(transactions.deductible, true),
        gte(transactions.transactionDate, start),
        lte(transactions.transactionDate, end),
      ),
    );
  return Number(rows[0]?.total ?? 0);
}
