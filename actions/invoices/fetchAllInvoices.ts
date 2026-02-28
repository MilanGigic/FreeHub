"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchAllInvoices(clientId: string) {
  try {
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
