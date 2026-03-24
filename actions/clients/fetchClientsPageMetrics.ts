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

const CLIENTS_PAGE_METRICS_TAG = "clients-page-metrics";

const fetchClientsPageMetricsCached = unstable_cache(
  async (userId: string) => {
    if (!userId) {
      return { success: false, error: "User ID is required" as const };
    }

    try {
      const from = daysAgo(30);

      const [[incomeRow], [expenseRow]] = await Promise.all([
        db
          .select({
            total: sql<string>`coalesce(sum(${transactions.amount}::numeric), 0)`,
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, userId),
              eq(transactions.type, "income"),
              gte(transactions.createdAt, from),
            ),
          ),
        db
          .select({
            total: sql<string>`coalesce(sum(${transactions.amount}::numeric), 0)`,
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, userId),
              eq(transactions.type, "expense"),
              gte(transactions.createdAt, from),
            ),
          ),
      ]);

      const outstanding = await db
        .select({
          total: sql<string>`coalesce(sum(${invoices.totalAmount}::numeric), 0)`,
          count: sql<number>`count(*)`,
        })
        .from(invoices)
        .where(
          and(
            eq(invoices.userId, userId),
            or(eq(invoices.status, "sent"), eq(invoices.status, "overdue")),
          ),
        );

      return {
        success: true,
        data: {
          revenueThisMonth: Number(incomeRow?.total ?? 0).toFixed(2),
          expensesThisMonth: Number(expenseRow?.total ?? 0).toFixed(2),
          outstandingInvoices: Number(outstanding[0]?.total ?? 0).toFixed(2),
          outstandingInvoiceCount: Number(outstanding[0]?.count ?? 0),
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
