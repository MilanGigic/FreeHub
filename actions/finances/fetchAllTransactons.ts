"use server";

import { db } from "@/db";
import { projects, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchAllTransactions(userId: string) {
  if (!userId)
    return {
      message: "Unauthorized...",
      data: [],
      success: false,
    };

  try {
    const data = await db
      .select({
        id: transactions.id,
        userId: transactions.userId,
        projectId: transactions.projectId,
        type: transactions.type,
        amount: transactions.amount,
        deductible: transactions.deductible,
        category: transactions.category,
        title: transactions.title,
        isRecurring: transactions.isRecurring,
        merchantName: transactions.merchantName,
        note: transactions.note,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        transactionDate: transactions.transactionDate,
        projectName: projects.name,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .innerJoin(projects, eq(transactions.projectId, projects.id));

    return {
      message: `Found ${data.length} transactions`,
      data,
      success: true,
    };
  } catch (error) {
    return {
      message: error as string,
      data: [],
      success: false,
    };
  }
}
