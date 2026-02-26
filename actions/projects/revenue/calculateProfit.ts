"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { ProjectRevenue } from "@/types/types";
import { eq } from "drizzle-orm";

export async function calculateProfit(
  projectId: string,
  revenueList: ProjectRevenue[],
  expenseList: ProjectRevenue[],
) {
  if (!projectId || !revenueList || !expenseList) {
    if (revenueList.length === 0 || expenseList.length === 0) {
      return {
        success: false,
        error: "Revenue and expense lists are required",
      };
    }
    return {
      success: false,
      error: "Project ID, revenue list, and expense list are required",
    };
  }

  const totalRevenue = revenueList.reduce(
    (acc, item) => acc + Number(item.amount),
    0,
  );
  const totalExpenses = expenseList.reduce(
    (acc, item) => acc + Number(item.amount),
    0,
  );

  const totalProfit = totalRevenue - totalExpenses;

  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId));

    if (!project) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    const [updatedProject] = await db
      .update(projects)
      .set({
        totalProfit: totalProfit.toString(),
        totalRevenue: totalRevenue.toString(),
        totalExpenses: totalExpenses.toString(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    return {
      success: true,
      data: updatedProject,
    };
  } catch (error) {
    console.error("Error calculating profit:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while calculating profit",
    };
  }
}
