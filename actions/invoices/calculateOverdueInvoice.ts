"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq, lt } from "drizzle-orm";

export async function calculateOverdueInvoices(clientId: string) {
  if (!clientId) return { success: false, error: "Client ID is required" };

  try {
    // First: mark any "sent" + past-due invoices as "overdue"
    await db
      .update(invoices)
      .set({ status: "overdue" })
      .where(
        and(
          eq(invoices.clientId, clientId),
          eq(invoices.status, "sent"),
          lt(invoices.dueDate, new Date()),
        ),
      );

    // Then: get all overdue invoices for this client (so header matches table)
    const overdueList = await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.clientId, clientId),
          eq(invoices.status, "overdue"),
        ),
      );

    const totalOverdue = overdueList.reduce(
      (acc, invoice) => acc + Number(invoice.totalAmount),
      0,
    );

    return {
      success: true,
      data: totalOverdue.toString(),
      count: overdueList.length,
    };
  } catch (error) {
    console.error("Error calculating overdue invoices:", error);
    return { success: false, error: error as string, count: 0 };
  }
}
