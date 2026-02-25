"use server";

import { db } from "@/db";
import { projectRevenue } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function addExpense(
  projectId: string,
  expense: string,
  note: string,
) {
  if (!projectId || !expense || !note) {
    return { success: false, error: "Project ID and expense are required" };
  }

  const existingExpense = await db
    .select()
    .from(projectRevenue)
    .where(eq(projectRevenue.projectId, projectId))
    .orderBy(desc(projectRevenue.createdAt))
    .limit(1);

  try {
    const [newExpense] = await db
      .insert(projectRevenue)
      .values({
        projectId,
        revenue: existingExpense.length > 0 ? existingExpense[0].revenue : "0",
        expenses: expense,
        note,
        profit: existingExpense.length > 0 ? existingExpense[0].profit : "0",
        margin: existingExpense.length > 0 ? existingExpense[0].margin : "0",
        hourlyRate:
          existingExpense.length > 0 ? existingExpense[0].hourlyRate : "0",
      })
      .returning();

    return { success: true, data: newExpense };
  } catch (error) {
    console.error("Error adding expense:", error);
    return { success: false, error: error as Error };
  }
}
