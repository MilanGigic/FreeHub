"use server";

import { db } from "@/db";
import { invoices, transactions } from "@/db/schema";
import { and, eq, gte, or, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export type CurrencyAmount = { currency: string; amount: string };

const CLIENTS_PAGE_METRICS_TAG = "clients-page-metrics";

const fetchClientsPageMetricsCached = unstable_cache(
  async (userId: string) => {
    if (!userId) {
      return { success: false, error: "User ID is required" as const };
    }

    try {
      const from = daysAgo(30);

      const [incomeRows, expenseRows] = await Promise.all([
        db
          .select({
            currency: transactions.currency,
            total: sql<string>`coalesce(sum(${transactions.amount}::numeric), 0)`,
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, userId),
              eq(transactions.type, "income"),
              gte(transactions.createdAt, from),
            ),
          )
          .groupBy(transactions.currency),
        db
          .select({
            currency: transactions.currency,
            total: sql<string>`coalesce(sum(${transactions.amount}::numeric), 0)`,
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, userId),
              eq(transactions.type, "expense"),
              gte(transactions.createdAt, from),
            ),
          )
          .groupBy(transactions.currency),
      ]);

      const outstandingRows = await db
        .select({
          currency: invoices.currency,
          total: sql<string>`coalesce(sum(${invoices.totalAmount}::numeric), 0)`,
          count: sql<number>`count(*)`,
        })
        .from(invoices)
        .where(
          and(
            eq(invoices.userId, userId),
            or(eq(invoices.status, "sent"), eq(invoices.status, "overdue")),
          ),
        )
        .groupBy(invoices.currency);

      const toList = (
        rows: {
          currency: "USD" | "EUR" | "GBP" | "JPY" | "RSD" | "CAD";
          total: string;
        }[],
      ): CurrencyAmount[] =>
        rows
          .filter((r) => Number(r.total) !== 0)
          .map((r) => ({
            currency: r.currency ?? "USD",
            amount: Number(r.total).toFixed(2),
          }));

      return {
        success: true,
        data: {
          revenue: toList(incomeRows),
          expenses: toList(expenseRows),
          outstanding: toList(outstandingRows),
          outstandingInvoiceCount: outstandingRows.reduce(
            (acc, r) => acc + Number(r.count ?? 0),
            0,
          ),
        },
      };
    } catch (error) {
      console.error("Error fetching clients page metrics:", error);
      return {
        success: false,
        error: "An error occurred while fetching metrics" as const,
      };
    }
  },
  // NOTE: cache is keyed by (keyParts + args). Keeping a stable keyPart is fine.
  ["clients-page-metrics"],
  { revalidate: 300, tags: [CLIENTS_PAGE_METRICS_TAG] },
);

export async function fetchClientsPageMetrics(userId: string) {
  return fetchClientsPageMetricsCached(userId);
}
