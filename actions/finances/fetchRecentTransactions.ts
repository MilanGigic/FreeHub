"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function fetchRecentTransactions(userId: string) {
  try {
    const data = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(10);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    return { success: false, error: error as Error };
  }
}
