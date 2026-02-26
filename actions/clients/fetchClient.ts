"use server";

import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchClient(clientId: string) {
  if (!clientId) {
    return { success: false, error: "Client ID is required" };
  }

  try {
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, clientId),
    });
    return { success: true, data: client };
  } catch (error) {
    console.error("Error fetching client:", error);
    return {
      success: false,
      error: "An error occurred while fetching the client",
    };
  }
}
