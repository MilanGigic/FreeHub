"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function fetchProjectTransactions(projectId: string) {
  if (!projectId) {
    return { success: false, error: "Project ID is required" };
  }

  try {
    const data = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.projectId, projectId)))
      .orderBy(desc(transactions.createdAt));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching project transactions:", error);
    return { success: false, error: error as Error };
  }
}
