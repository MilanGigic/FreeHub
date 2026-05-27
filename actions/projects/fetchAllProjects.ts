"use server";

import { db } from "@/db";
import { clients, projects } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function fetchAllProjects(userId: string) {
  if (!userId) {
    return { success: false, error: "User ID is required" };
  }

  try {
    const data = await db
      .select({
        id: projects.id,
        userId: projects.userId,
        clientId: projects.clientId,
        clientName: clients.clientName,
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
      .where(eq(projects.userId, userId))
      .innerJoin(clients, eq(projects.clientId, clients.id))
      .orderBy(desc(projects.createdAt));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return {
      success: false,
      error: "An error occurred while fetching all projects",
    };
  }
}
