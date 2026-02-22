"use server";

import { db } from "@/db";
import { projectCalendar } from "@/db/schema/schema";

export async function addEntryToCalendar(
  projectId: string,
  date: Date,
  note: string,
  hoursWorked: number,
) {
  try {
    await db.insert(projectCalendar).values({
      projectId,
      date,
      note,
      hoursWorked,
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding entry to calendar:", error);
    return { success: false, error: error as Error };
  }
}
