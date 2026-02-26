"use server";

import { db } from "@/db";
import { projectFinance } from "@/db/schema";

export async function addIncome(
  projectId: string,
  revenue: string,
  note: string,
) {
  if (!projectId || !revenue || !note) {
    return { success: false, error: "Project ID and revenue are required" };
  }

  try {
    const [data] = await db
      .insert(projectFinance)
      .values({
        projectId,
        type: "income",
        amount: revenue,
        note,
      })
      .returning();
    return { success: true, data };
  } catch (error) {
    console.error("Error adding revenue:", error);
    return { success: false, error: error as Error };
  }
}
