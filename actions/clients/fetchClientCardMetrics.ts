"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq, or, sql } from "drizzle-orm";

export type ClientCardMetrics = {
  clientId: string;
  outstandingTotal: string;
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
        .groupBy(invoices.clientId),
      db
        .select({
          clientId: invoices.clientId,
          avgDays: sql<number>`avg(extract(epoch from (${invoices.paymentDate} - ${invoices.issueDate})) / 86400)`,
        })
        .from(invoices)
        .where(
          and(eq(invoices.userId, userId), eq(invoices.status, "paid")),
        )
        .groupBy(invoices.clientId),
    ]);

    const outstandingMap = new Map(
      outstandingRows.map((r) => [r.clientId, r.total]),
    );
    const paymentTimeMap = new Map(
      paymentTimeRows.map((r) => [r.clientId, r.avgDays]),
    );

    const allClientIds = new Set([
      ...outstandingMap.keys(),
      ...paymentTimeMap.keys(),
    ]);

    const data: ClientCardMetrics[] = Array.from(allClientIds).map((clientId) => ({
      clientId,
      outstandingTotal: Number(outstandingMap.get(clientId) ?? 0).toFixed(2),
      avgPaymentDays: paymentTimeMap.has(clientId)
        ? Math.round(paymentTimeMap.get(clientId)!)
        : null,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching client card metrics:", error);
    return { success: false, error: "Failed to fetch client metrics" };
  }
}
