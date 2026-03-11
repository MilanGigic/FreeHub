"use server";

import { db } from "@/db";
import { projects, transactions } from "@/db/schema";
import { Project } from "@/types/types";
import { and, eq, inArray } from "drizzle-orm";

export async function calculateTotalExpenses(
  userId: string,
  userProjects: Project[],
) {
  if (!userId || !userProjects) {
    return { success: false, error: "All fields are required" };
  }

  if (userProjects.length === 0) {
    return { success: true, data: "0.00" };
  }

  try {
    const projectIds = userProjects.map((project) => project.id);

    const projectsData = await db.query.projects.findMany({
      where: and(inArray(projects.id, projectIds), eq(projects.userId, userId)),
    });

    if (!projectsData || projectsData.length === 0) {
      return { success: false, error: "Projects not found" };
    }

    const projectExpenses = await db.query.transactions.findMany({
      where: and(
        inArray(transactions.projectId, projectIds),
        eq(transactions.userId, userId),
        eq(transactions.type, "expense"),
      ),
    });

    const projectExpensesTotal = projectExpenses.reduce((acc, expense) => {
      const amount = parseFloat(expense.amount ?? "0");
      return acc + (isNaN(amount) ? 0 : amount);
    }, 0);

    const total = projectExpensesTotal.toFixed(2);

    return { success: true, data: total };
  } catch (error) {
    console.error("Error calculating total expenses:", error);
    return { success: false, error: error as string };
  }
}
