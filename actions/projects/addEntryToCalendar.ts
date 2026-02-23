"use server";

import { db } from "@/db";
import { projectCalendar } from "@/db/schema/schema";
import { fetchExistingEntries } from "./fetchExistingEntires";

export async function addEntryToCalendar(
  projectId: string,
  date: Date,
  note: string,
  hoursWorked: number,
) {
  try {
    const [data] = await db
      .insert(projectCalendar)
      .values({
        projectId,
        date,
        note,
        hoursWorked,
      })
      .returning();

    if (!data) {
      return { success: false, error: "Failed to add entry to calendar" };
    }

    const newEntries = await fetchExistingEntries(projectId, date);

    return { success: true, newEntries };
  } catch (error) {
    console.error("Error adding entry to calendar:", error);
    return { success: false, error: error as Error };
  }
}
