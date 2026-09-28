"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq, or, sql } from "drizzle-orm";
import { CurrencyAmount } from "./fetchClientsPageMetrics";

export type ClientCardMetrics = {
  clientId: string;
  outstanding: CurrencyAmount[];
  avgPaymentDays: number | null;
};

export async function fetchClientCardMetrics(
  userId: string,
): Promise<{ success: boolean; data?: ClientCardMetrics[]; error?: string }> {
  if (!userId) return { success: false, error: "User ID is required" };

  try {
    const [outstandingRows, paymentTimeRows] = await Promise.all([
      db
        .select({
          currency: invoices.currency,
          clientId: invoices.clientId,
          total: sql<string>`coalesce(sum(${invoices.totalAmount}::numeric), 0)`,
        })
        .from(invoices)
        .where(
          and(
            eq(invoices.userId, userId),
            or(eq(invoices.status, "sent"), eq(invoices.status, "overdue")),
          ),
        )
        .groupBy(invoices.clientId, invoices.currency),
      db
        .select({
          clientId: invoices.clientId,
          avgDays: sql<number>`avg(extract(epoch from (${invoices.paymentDate} - ${invoices.issueDate})) / 86400)`,
        })
        .from(invoices)
        .where(and(eq(invoices.userId, userId), eq(invoices.status, "paid")))
        .groupBy(invoices.clientId),
    ]);

    const outstandingByClient = new Map<string, CurrencyAmount[]>();
    for (const row of outstandingRows) {
      if (Number(row.total) === 0) continue;

      const list = outstandingByClient.get(row.clientId) ?? [];

      list.push({
        currency: row.currency ?? "USD",
        amount: Number(row.total).toFixed(2),
      });

      outstandingByClient.set(row.clientId, list);
    }

    const paymentTimeMap = new Map(
      paymentTimeRows.map((r) => [r.clientId, r.avgDays]),
    );

    const allClientIds = new Set([
      ...outstandingByClient.keys(),
      ...paymentTimeMap.keys(),
    ]);

    const data: ClientCardMetrics[] = Array.from(allClientIds).map(
      (clientId) => ({
        clientId,
        outstanding: outstandingByClient.get(clientId) ?? [],
        avgPaymentDays: paymentTimeMap.has(clientId)
          ? Math.round(paymentTimeMap.get(clientId)!)
          : null,
      }),
    );

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching client card metrics:", error);
    return { success: false, error: "Failed to fetch client metrics" };
  }
}
