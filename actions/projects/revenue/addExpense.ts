"use server";

import { db } from "@/db";
import { projectFinance, projects, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function addExpense(
  userId: string,
  projectId: string,
  expense: string,
  note: string,
  deductible: boolean,
) {
  if (!projectId || !expense || !note) {
    return { success: false, error: "Project ID and expense are required" };
  }

  try {
    const currentProject = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!currentProject) {
      return { success: false, error: "Project not found" };
    }

    const [newExpense] = await db
      .insert(projectFinance)
      .values({ userId, projectId, type: "expense", amount: expense, note })
      .returning();

    await db
      .insert(transactions)
      .values({
        userId,
        projectId,
        amount: expense,
        type: "expense",
        note,
        deductible,
      })
      .returning();

    const newTotalExpenses = (
      Number(currentProject.totalExpenses) + Number(expense)
    ).toFixed(2);

    const newTotalProfit = (
      Number(currentProject.totalProfit) - Number(expense)
    ).toFixed(2);

    const [updatedProject] = await db
      .update(projects)
      .set({
        totalExpenses: newTotalExpenses,
        totalProfit: newTotalProfit,
      })
      .where(eq(projects.id, projectId))
      .returning();

    revalidateTag("clients-page-metrics", "max");
    revalidateTag("dashboard-data", "max");
    return { success: true, data: newExpense, projectData: updatedProject };
  } catch (error) {
    console.error("Error adding expense:", error);
    return { success: false, error: error as Error };
  }
}
