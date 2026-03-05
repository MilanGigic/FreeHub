"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq, or } from "drizzle-orm";

export async function calculateOutstandingInvoices(clientId: string) {
  if (!clientId) {
    console.log(
      "[calculateOutstandingInvoices] No clientId provided. Returning error.",
    );
    return { success: false, error: "Client ID is required" };
  }

  console.log("[calculateOutstandingInvoices] Client ID provided:", clientId);

  try {
    console.log(
      `[calculateOutstandingInvoices] Fetching invoices for clientId: ${clientId} with status 'sent'...`,
    );
    const data = await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.clientId, clientId),
          or(eq(invoices.status, "sent"), eq(invoices.status, "overdue")),
        ),
      );

    console.log(
      `[calculateOutstandingInvoices] Found ${data.length} 'sent' invoices. Calculating total outstanding amount...`,
    );
    const outstandingInvoices = data.reduce(
      (acc, invoice) => acc + Number(invoice.totalAmount),
      0,
    );
    console.log(
      `[calculateOutstandingInvoices] Total outstanding amount for clientId ${clientId}: $${outstandingInvoices}`,
    );
    return { success: true, data: outstandingInvoices.toString() };
  } catch (error) {
    console.error(
      "[calculateOutstandingInvoices] Error calculating outstanding invoices:",
      error,
    );
    return { success: false, error: error as string };
  }
}
