"use server";

import { db } from "@/db";
import { projectFinance } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function fetchIncomeData(projectId: string) {
  if (!projectId) {
    return { success: false, error: "Project ID is required" };
  }

  try {
    const data = await db
      .select()
      .from(projectFinance)
      .where(
        and(
          eq(projectFinance.projectId, projectId),
          eq(projectFinance.type, "income"),
        ),
      )
      .orderBy(desc(projectFinance.createdAt));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching income data:", error);
    return { success: false, error: error as Error };
  }
}
