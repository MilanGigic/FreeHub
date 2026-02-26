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
      .select()
      .from(projects)
      .where(eq(projects.clientId, client.id));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching clients projects:", error);
    return {
      success: false,
      error: "An error occurred while fetching clients projects",
    };
  }
}
