"use server";

import { db } from "@/db";
import { projectFinance, projects, transactions } from "@/db/schema";
import { recalculateProjectTotals } from "@/utils/recalculateProjectTotals";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function addIncome(
  userId: string,
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
        userId,
        projectId,
        type: "income",
        amount: revenue,
        note,
      })
      .returning();

    await db.insert(transactions).values({
      userId,
      projectId,
      amount: revenue,
      type: "income",
      note,
    });

    const totals = await recalculateProjectTotals(userId, projectId);

    const updatedProject = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    revalidateTag("clients-page-metrics", "max");
    revalidateTag("dashboard-data", "max");
    return { success: true, data, projectData: updatedProject, totals };
  } catch (error) {
    console.error("Error adding revenue:", error);
    return { success: false, error: error as Error };
  }
}
