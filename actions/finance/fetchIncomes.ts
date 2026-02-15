"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function fetchIncomes(userId: string) {
  try {
    const data = await db
      .select()
      .from(transactions)
      .where(
        and(eq(transactions.userId, userId), eq(transactions.type, "income")),
      );
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching incomes:", error);
    return { success: false, error: error as Error };
  }
}
