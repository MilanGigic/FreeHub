"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function fetchPaidInvoices(userId: string, projectId: string) {
  console.log("[fetchPaidInvoices] Called with:", {
    userId,
    projectId,
  });

  if (!userId || !projectId) {
    console.warn("[fetchPaidInvoices] Missing required fields:", {
      userId,
      projectId,
    });
    return { success: false, error: "All fields are required" };
  }

  try {
    const data = await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.userId, userId),
          eq(invoices.status, "paid"),
          eq(invoices.projectId, projectId),
        ),
      );

    console.log("[fetchPaidInvoices] Data fetched:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching paid invoices:", error);
    return { success: false, error: error as string };
  }
}
