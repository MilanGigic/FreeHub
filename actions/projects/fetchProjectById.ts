"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchProjectById(projectId: string) {
  if (!projectId) {
    return { success: false, error: "Project ID is required" };
  }

  try {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    if (!project) {
      return { success: false, error: "Project not found" };
    }
    return { success: true, data: project };
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return {
      success: false,
      error: "An error occurred while fetching the project",
    };
  }
}
