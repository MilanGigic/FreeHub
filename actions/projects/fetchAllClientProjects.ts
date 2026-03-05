"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function fetchAllClientProjects(clientId: string, userId: string) {
  if (!userId) {
    return { success: false, error: "User ID is required" };
  }

  try {
    const data = await db
      .select()
      .from(projects)
      .where(and(eq(projects.userId, userId), eq(projects.clientId, clientId)));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return {
      success: false,
      error: "An error occurred while fetching all projects",
    };
  }
}
