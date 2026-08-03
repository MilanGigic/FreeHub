"use server";

import { db } from "@/db";
import { clients, projects } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function fetchAllClientProjects(clientId: string, userId: string) {
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
      .where(and(eq(projects.userId, userId), eq(projects.clientId, clientId)))
      .innerJoin(clients, eq(projects.clientId, clients.id));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching all client projects:", error);
    return {
      success: false,
      error: "An error occurred while fetching all client projects",
    };
  }
}
