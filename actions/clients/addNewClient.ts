"use server";

import { db } from "@/db";
import { clients } from "@/db/schema";
import { ClientForm } from "@/types/types";
import { eq } from "drizzle-orm";

export async function addNewClient(clientForm: ClientForm, userId: string) {
  const { firstName, lastName, email, currency, status, startDate, endDate } =
    clientForm;

  if (!userId) {
    return { success: false, error: "User ID is required" };
  }

  if (!firstName || !lastName || !email || !currency || !status || !startDate) {
    return { success: false, error: "All fields are required" };
  }

  try {
    await db.insert(clients).values({
      userId,
      firstName,
      lastName,
      email,
      currency: currency as "USD" | "EUR" | "GBP" | "JPY" | "RSD" | "CAD",
      status: status as "active" | "paused" | "archived",
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    });

    const data = await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId));

    return { success: true, data };
  } catch (error) {
    console.error("Error adding new client:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while adding new client",
    };
  }
}
