"use server";

import { db } from "@/db";
import { projectFinance } from "@/db/schema";

export async function addExpense(
  projectId: string,
  expense: string,
  note: string,
) {
  if (!projectId || !expense || !note) {
    return { success: false, error: "Project ID and expense are required" };
  }

  try {
    const [newExpense] = await db
      .insert(projectFinance)
      .values({
        projectId,
        type: "expense",
        amount: expense,
        note,
      })
      .returning();
    return { success: true, data: newExpense };
  } catch (error) {
    console.error("Error adding expense:", error);
    return { success: false, error: error as Error };
  }
}
