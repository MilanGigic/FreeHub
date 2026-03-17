"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq, lt } from "drizzle-orm";

export async function fetchAllInvoices(clientId: string) {
  try {
    // Keep invoice statuses consistent: any past-due "sent" invoices become "overdue".
    // This avoids extra round-trips from the client to "calculate overdue" separately.
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

    const data = await db
      .select()
      .from(invoices)
      .where(eq(invoices.clientId, clientId));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching all invoices:", error);
    return { success: false, error: error as string };
  }
}
