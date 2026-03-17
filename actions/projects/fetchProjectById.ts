"use server";

import { db } from "@/db";
import { clients, projects } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function fetchProjectById(projectId: string) {
  if (!projectId) {
    return { success: false, error: "Project ID is required" };
  }

  try {
    const result = await db
      .select({
        id: projects.id,
        userId: projects.userId,
        clientId: projects.clientId,
        clientName: sql<string>`concat(${clients.firstName}, ' ', ${clients.lastName})`,
        name: projects.name,
        description: projects.description,
        totalRevenue: projects.totalRevenue,
        totalExpenses: projects.totalExpenses,
        totalProfit: projects.totalProfit,
        totalMargin: projects.totalMargin,
        totalHoursWorked: projects.totalHoursWorked,
        status: projects.status,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .innerJoin(clients, eq(projects.clientId, clients.id))
      .where(eq(projects.id, projectId));

    if (!result || result.length === 0) {
      return { success: false, error: "Project not found" };
    }

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return {
      success: false,
      error: "An error occurred while fetching the project",
    };
  }
}
