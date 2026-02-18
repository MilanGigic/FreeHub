"use server";

import { db } from "@/db";
import { clients } from "@/db/schema/schema";

export async function fetchAllClients() {
  try {
    const data = await db.select().from(clients);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching all clients:", error);
    return {
      success: false,
      error: "An error occurred while fetching all clients",
    };
  }
}
