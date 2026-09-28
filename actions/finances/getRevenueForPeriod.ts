"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { getCurrentQuarter, getQuarterRange } from "@/utils/getQuarterRange";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { getRates } from "../translateCurrency";
import { convertMinor, toMinor } from "@/lib/currency";

export async function getRevenueForPeriod(
  userId: string,
  period: "month" | "quarter" | "year",
  options?: { year?: number; quarter?: 1 | 2 | 3 | 4 },
) {
  if (!userId) throw new Error("[getRevenueForPeriod]::UserID required!");

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
      currency: transactions.currency,
      total: sql<string>`coalesce(sum(${transactions.amount}), 0)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.type, "income"),
        gte(transactions.transactionDate, start),
        lte(transactions.transactionDate, end),
      ),
    )
    .groupBy(transactions.currency);

  if (rows.length === 0) return 0;

  // The tax engine runs in RSD, so conversion happens once, here, at the
  // source — every caller downstream (including calculateUserTax) already
  // gets an RSD figure and never has to think about currency again.
  const currencies = rows.map((r) => r.currency ?? "RSD");
  const rates = await getRates([...currencies, "RSD"]);

  const totalMinor = rows.reduce(
    (acc, r) =>
      acc + convertMinor(toMinor(r.total), r.currency ?? "RSD", "RSD", rates),
    0,
  );

  return totalMinor / 100; // decimal RSD, same return convention as before
}
