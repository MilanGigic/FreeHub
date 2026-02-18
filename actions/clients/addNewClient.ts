"use server";

import { db } from "@/db";
import { clients } from "@/db/schema";
import { ClientForm } from "@/types/types";

export async function addNewClient(clientForm: ClientForm) {
  const { firstName, lastName, email, currency, status, startDate, endDate } =
    clientForm;

  if (!firstName || !lastName || !email || !currency || !status || !startDate) {
    return { success: false, error: "All fields are required" };
  }

  try {
    const [data] = await db
      .insert(clients)
      .values({
        firstName,
        lastName,
        email,
        currency: currency as "USD" | "EUR" | "GBP" | "JPY" | "RSD" | "CAD",
        status: status as "active" | "paused" | "archived",
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      })
      .returning();

    console.log("New client added successfully:", data);
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
