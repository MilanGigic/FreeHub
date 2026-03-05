"use server";

import { db } from "@/db";
import { invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function calculateAveragePaymentTime(userId: string) {
  if (!userId) return { success: false, error: "User ID is required" };

  try {
    const data = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.userId, userId), eq(invoices.status, "paid")));

    const averagePaymentTime =
      data.reduce((acc, invoice) => {
        return (
          acc +
          (invoice.paymentDate!.getTime() - invoice.issueDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
      }, 0) / data.length;

    return { success: true, data: averagePaymentTime.toString() };
  } catch (error) {
    console.error("Error calculating average payment time:", error);
    return { success: false, error: error as string };
  }
}
