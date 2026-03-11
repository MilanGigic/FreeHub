"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, eq, gte } from "drizzle-orm";
import { startOfMonth } from "date-fns";

export async function fetchUserTransactions(
  userId: string,
  transactionType: "income" | "expense",
) {
  if (!userId || !transactionType) {
    return { success: false, error: "All fields are required" };
  }

  try {
    const data = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, transactionType),
          gte(transactions.createdAt, startOfMonth(new Date())),
        ),
      );

    const total = data.reduce(
      (acc, expense) => acc + Number(expense.amount || 0),
      0,
    );
    return { success: true, total };
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return { success: false, error: error as Error };
  }
}
