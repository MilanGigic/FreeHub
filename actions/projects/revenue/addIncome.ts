"use server";

import { db } from "@/db";
import { projectFinance, projects } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) return { success: false, error: "Project not found" };

    const currentTotal = Number(project.totalRevenue ?? 0);

    await db
      .update(projects)
      .set({
        totalRevenue: (currentTotal + Number(revenue)).toFixed(2),
      })
      .where(eq(projects.id, projectId));

    return { success: true, data };
  } catch (error) {
    console.error("Error adding revenue:", error);
    return { success: false, error: error as Error };
  }
}
