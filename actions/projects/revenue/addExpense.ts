"use server";

import { db } from "@/db";
import { projectFinance, projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addExpense(
  userId: string,
  projectId: string,
  expense: string,
  note: string,
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

    return { success: true, data: newExpense, projectData: updatedProject };
  } catch (error) {
    console.error("Error adding expense:", error);
    return { success: false, error: error as Error };
  }
}
