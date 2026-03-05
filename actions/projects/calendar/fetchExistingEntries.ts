"use server";

import { db } from "@/db";
import { projectCalendar } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function fetchExistingEntries(
  userId: string,
  projectId: string,
  selectedDate: Date | null,
) {
  if (!projectId || !selectedDate || !userId)
    return {
      success: false,
      error: "Project ID and selected date are required",
    };
  try {
    const data = await db.query.projectCalendar.findMany({
      where: and(
        eq(projectCalendar.userId, userId),
        eq(projectCalendar.projectId, projectId),
        eq(projectCalendar.date, selectedDate),
      ),
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching existing entries:", error);
    return { success: false, error: error as string };
  }
}
