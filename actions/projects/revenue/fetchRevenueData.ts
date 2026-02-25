"use server";

import { db } from "@/db";
import { projectRevenue } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchRevenueData(projectId: string) {
  if (!projectId) {
    return { success: false, error: "Project ID is required" };
  }

  try {
    const data = await db
      .select()
      .from(projectRevenue)
      .where(eq(projectRevenue.projectId, projectId));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return { success: false, error: error as Error };
  }
}
