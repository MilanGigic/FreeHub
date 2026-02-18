"use server";

import { db } from "@/db";
import { projects } from "@/db/schema/schema";
import { Client, ProjectForm, ProjectStatus, User } from "@/types/types";

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
    const [data] = await db
      .insert(projects)
      .values({
        clientId: client.id,
        name,
        description,
        status: status as ProjectStatus,
        userId: user.id,
      })
      .returning();
    console.log("New project added successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error adding new project:", error);
    return {
      success: false,
      error: "An error occurred while adding new project",
    };
  }
}
