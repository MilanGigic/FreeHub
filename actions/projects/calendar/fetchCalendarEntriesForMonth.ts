"use server";

import { db } from "@/db";
import { projectCalendar } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export type MonthEntry = {
  date: Date;
  hoursWorked: number;
  note: string;
  id: string;
};

/**
 * Fetches all calendar entries for a project in a given month.
 * Returns flat list; caller can group by day and sum hours.
 */
export async function fetchCalendarEntriesForMonth(
  userId: string,
  projectId: string,
  year: number,
  month: number,
) {
  if (!projectId || !userId) {
    return { success: false, error: "Project ID and user ID are required", data: [] };
  }
  try {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);

    const data = await db.query.projectCalendar.findMany({
      where: and(
        eq(projectCalendar.userId, userId),
        eq(projectCalendar.projectId, projectId),
        gte(projectCalendar.date, start),
        lt(projectCalendar.date, end),
      ),
      columns: { id: true, date: true, hoursWorked: true, note: true },
    });

    return { success: true, data: data as MonthEntry[] };
  } catch (error) {
    console.error("Error fetching calendar entries for month:", error);
    return { success: false, error: error as Error, data: [] };
  }
}
