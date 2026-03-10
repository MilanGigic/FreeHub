"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function calculateAllOverdueInvoices(userId: string) {
  try {
    const data = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.userId, userId), eq(invoices.status, "overdue")));

    const overdueInvoices = data.reduce(
      (acc, invoice) => acc + Number(invoice.totalAmount || 0),
      0,
    );

    return {
      success: true,
      data: overdueInvoices.toString(),
      count: data.length,
    };
  } catch (error) {
    console.error("Error calculating all overdue invoices:", error);
    return {
      success: false,
      error: "An error occurred while calculating all overdue invoices",
    };
  }
}
