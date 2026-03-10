"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";

export async function calculateUnpaidInvoices(userId: string) {
  if (!userId) return { success: false, error: "User ID is required" };

  try {
    const data = await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.userId, userId),
          or(eq(invoices.status, "sent"), eq(invoices.status, "overdue")),
        ),
      );

    const unpaidInvoices = data.reduce(
      (acc, invoice) => acc + Number(invoice.totalAmount),
      0,
    );

    return { success: true, data: unpaidInvoices.toString() };
  } catch (error) {
    console.error("Error calculating unpaid invoices:", error);
    return { success: false, error: error as string };
  }
}
