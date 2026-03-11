"use server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function calculateTotalRevenue(userId: string) {
  if (!userId) return { success: false, error: "userId required" };

  try {
    const data = await db
      .select()
      .from(transactions)
      .where(
        and(eq(transactions.userId, userId), eq(transactions.type, "income")),
      );

    const total = data
      .reduce((acc, t) => acc + parseFloat(t.amount ?? "0"), 0)
      .toFixed(2);

    return { success: true, data: total };
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    return { success: false, error: error as string };
  }
}
