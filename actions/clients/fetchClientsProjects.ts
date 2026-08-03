"use server";

import { db } from "@/db";
import { clients, projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchClientsProjects(clientId: string) {
  if (!clientId) {
    return { success: false, error: "Client ID is required" };
  }

  const client = await db.query.clients.findFirst({
    where: eq(clients.id, clientId),
  });

  if (!client) {
    return { success: false, error: "Client not found" };
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
      .where(eq(projects.clientId, client.id))
      .innerJoin(clients, eq(projects.clientId, clients.id));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching clients projects:", error);
    return {
      success: false,
      error: "An error occurred while fetching clients projects",
    };
  }
}
