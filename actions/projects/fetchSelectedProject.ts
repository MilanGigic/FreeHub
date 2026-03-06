"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function fetchSelectedProject(projectId: string, userId: string) {
  if (!projectId) {
    return { success: false, error: "Project ID is required" };
  }

  try {
    const data = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    });

    if (!data) {
      return { success: false, error: "Project not found" };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching selected project:", error);
    return { success: false, error: error as Error };
  }
}
