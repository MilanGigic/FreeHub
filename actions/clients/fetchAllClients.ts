"use server";

import { db } from "@/db";
import { clients } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

export async function fetchAllClients(userId: string) {
  try {
    const data = await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId));
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching all clients:", error);
    return {
      success: false,
      error: "An error occurred while fetching all clients",
    };
  }
}
