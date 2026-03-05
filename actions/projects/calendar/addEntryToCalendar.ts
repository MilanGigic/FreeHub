"use server";

import { db } from "@/db";
import { projectCalendar } from "@/db/schema/schema";
import { fetchExistingEntries } from "@/actions/projects/calendar/fetchExistingEntries";
import { storeTotalHours } from "../storeTotalHours";

export async function addEntryToCalendar(
  userId: string,
  projectId: string,
  date: Date,
  note: string,
  hoursWorked: number,
) {
  try {
    const [data] = await db
      .insert(projectCalendar)
      .values({
        userId,
        projectId,
        date,
        note,
        hoursWorked,
      })
      .returning();

    if (!data) {
      return { success: false, error: "Failed to add entry to calendar" };
    }

    const newEntries = await fetchExistingEntries(userId, projectId, date);

    await storeTotalHours(projectId);

    return { success: true, newEntries };
  } catch (error) {
    console.error("Error adding entry to calendar:", error);
    return { success: false, error: error as Error };
  }
}
