"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";

export async function calculateAllOutstandingInvoices(userId: string) {
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

    const outstandingInvoices = data.reduce(
      (acc, invoice) => acc + Number(invoice.totalAmount),
      0,
    );

    return {
      success: true,
      data: outstandingInvoices.toString(),
      count: data.length,
    };
  } catch (error) {
    console.error("Error calculating all outstanding invoices:", error);
    return {
      success: false,
      error: "An error occurred while calculating all outstanding invoices",
    };
  }
}
