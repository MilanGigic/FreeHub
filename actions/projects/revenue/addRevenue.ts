"use server";

import { db } from "@/db";
import { projectRevenue } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function addRevenue(
  projectId: string,
  revenue: string,
  note: string,
) {
  if (!projectId || !revenue || !note) {
    return { success: false, error: "Project ID and revenue are required" };
  }

  const existingRevenue = await db
    .select()
    .from(projectRevenue)
    .where(eq(projectRevenue.projectId, projectId))
    .orderBy(desc(projectRevenue.createdAt))
    .limit(1);

  try {
    const [data] = await db
      .insert(projectRevenue)
      .values({
        projectId,
        revenue,
        expenses:
          existingRevenue.length > 0 ? existingRevenue[0].expenses : "0",
        note,
        profit: existingRevenue.length > 0 ? existingRevenue[0].profit : "0",
        margin: existingRevenue.length > 0 ? existingRevenue[0].margin : "0",
        hourlyRate:
          existingRevenue.length > 0 ? existingRevenue[0].hourlyRate : "0",
      })
      .returning();
    return { success: true, data };
  } catch (error) {
    console.error("Error adding revenue:", error);
    return { success: false, error: error as Error };
  }
}
