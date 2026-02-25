"use server";

import { db } from "@/db";
import { projectCalendar } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function fetchDataForSelectedDate(projectId: string, date: Date) {
  try {
    const data = await db.query.projectCalendar.findFirst({
      where: and(
        eq(projectCalendar.projectId, projectId),
        eq(projectCalendar.date, date),
      ),
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching data for selected date:", error);
    return { success: false, error: error as Error };
  }
}
