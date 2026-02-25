"use server";

import { db } from "@/db";
import { projectCalendar, projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function storeTotalHours(projectId: string) {
  if (!projectId) return { success: false, error: "Project ID is required" };

  await db.transaction(async (tx) => {
    const project = await tx.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) return { success: false, error: "Project not found" };

    const calendarEntries = await tx
      .select()
      .from(projectCalendar)
      .where(eq(projectCalendar.projectId, projectId));

    let totalHours = 0;

    calendarEntries.forEach((entry) => {
      totalHours += entry.hoursWorked;
    });

    await tx
      .update(projects)
      .set({ totalHoursWorked: totalHours })
      .where(eq(projects.id, projectId));
  });
}
