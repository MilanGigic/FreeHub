"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function fetchActiveProjects(userId: string) {
  if (!userId) {
    return { success: false, error: "User ID is required" };
  }

  try {
    const data = await db
      .select()
      .from(projects)
      .where(and(eq(projects.userId, userId), eq(projects.status, "active")));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching active projects:", error);
    return {
      success: false,
      error: "An error occurred while fetching active projects",
    };
  }
}
