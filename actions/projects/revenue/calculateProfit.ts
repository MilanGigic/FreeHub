"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { Invoice, ProjectRevenue } from "@/types/types";
import { eq } from "drizzle-orm";

export async function calculateProfit(
  projectId: string,
  revenueList: ProjectRevenue[],
  expenseList: ProjectRevenue[],
  paidInvoices: Invoice[],
) {
  if (!projectId) {
    return { success: false, error: "Project ID is required" };
  }
  if (!revenueList || !expenseList || !paidInvoices) {
    return { success: false, error: "Revenue and expense lists are required" };
  }

  const totalRevenue = revenueList.reduce(
    (acc, item) => acc + Number(item.amount),
    0,
  );

  const totalPaidInvoices = paidInvoices.reduce(
    (acc, item) => acc + Number(item.totalAmount),
    0,
  );
  const totalExpenses = expenseList.reduce(
    (acc, item) => acc + Number(item.amount),
    0,
  );

  const totalProfit = totalRevenue + totalPaidInvoices - totalExpenses;

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
        totalRevenue: (totalRevenue + totalPaidInvoices).toFixed(2),
        totalExpenses: totalExpenses.toFixed(2),
        totalProfit: totalProfit.toFixed(2),
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
