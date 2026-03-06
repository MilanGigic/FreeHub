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
  if (!projectId) return { success: false, error: "Project ID is required" };

  try {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) return { success: false, error: "Project not found" };

    const revenueAndInvoices =
      revenueList.reduce((acc, revenue) => acc + Number(revenue.amount), 0) +
      paidInvoices.reduce(
        (acc, invoice) => acc + Number(invoice.totalAmount),
        0,
      );

    const expenses = expenseList.reduce(
      (acc, expense) => acc + Number(expense.amount),
      0,
    );

    const [updatedProject] = await db
      .update(projects)
      .set({
        totalProfit: (
          Number(project.totalProfit ?? 0) +
          revenueAndInvoices -
          expenses
        )
          .toFixed(2)
          .toString(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    return { success: true, data: updatedProject };
  } catch (error) {
    console.error("Error calculating profit:", error);
    return { success: false, error: error as Error };
  }
}
