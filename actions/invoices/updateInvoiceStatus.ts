"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InvoiceStatus } from "@/types/types";

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus,
  clientId: string,
) {
  if (!id || !status) {
    return { success: false, error: "All fields are required" };
  }
  try {
    await db.update(invoices).set({ status }).where(eq(invoices.id, id));

    const data = await db
      .select()
      .from(invoices)
      .where(eq(invoices.clientId, clientId));
    return { success: true, data };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return { success: false, error: error as string };
  }
}
