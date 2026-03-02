"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function calculatePaidInvoices(clientId: string) {
  if (!clientId) return { success: false, error: "Client ID is required" };

  try {
    const data = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.clientId, clientId), eq(invoices.status, "paid")));

    const totalPaid = data.reduce(
      (acc, invoice) => acc + Number(invoice.totalAmount),
      0,
    );

    return { success: true, data: totalPaid.toString() };
  } catch (error) {
    console.error("Error calculating paid invoices:", error);
    return { success: false, error: error as string };
  }
}
