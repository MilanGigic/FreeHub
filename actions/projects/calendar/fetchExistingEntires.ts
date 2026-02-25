"use server";

import { db } from "@/db";
import { projectCalendar } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function fetchExistingEntries(
  projectId: string,
  selectedDate: Date | null,
) {
  console.log(
    "fetching existing entries for projectId:",
    projectId,
    "and selectedDate:",
    selectedDate,
  );
  if (!projectId || !selectedDate)
    return {
      success: false,
      error: "Project ID and selected date are required",
    };
  try {
    const data = await db.query.projectCalendar.findMany({
      where: and(
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
