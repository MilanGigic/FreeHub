"use server";

import { db } from "@/db";
import { clients, projects } from "@/db/schema/schema";
import { Client, ProjectForm, ProjectStatus, User } from "@/types/types";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function addNewProject(
  projectForm: ProjectForm,
  client: Client,
  user: User,
) {
  const { name, description, status } = projectForm;

  if (!name || !description || !status || !client || !user) {
    return { success: false, error: "All fields are required" };
  }

  try {
    await db.insert(projects).values({
      clientId: client.id,
      name,
      description,
      status: status as ProjectStatus,
      userId: user.id,
    });

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
      .where(eq(projects.userId, user.id))
      .innerJoin(clients, eq(projects.clientId, clients.id));

    const clientProjects = await db
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

    console.log("New project added successfully:", data);
    revalidateTag("dashboard-data", "max");
    return { success: true, data, clientProjects };
  } catch (error) {
    console.error("Error adding new project:", error);
    return {
      success: false,
      error: "An error occurred while adding new project",
    };
  }
}
