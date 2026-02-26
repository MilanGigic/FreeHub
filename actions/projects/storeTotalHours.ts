"use server";

import { db } from "@/db";
import { projectCalendar, projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function storeTotalHours(projectId: string) {
  if (!projectId) {
    console.log("No projectId provided, aborting and returning error.");
    return { success: false, error: "Project ID is required" };
  }

  await db.transaction(async (tx) => {
    console.log(`Looking for project with id ${projectId}...`);
    const project = await tx.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      console.log(`Project with id ${projectId} not found.`);
      return { success: false, error: "Project not found" };
    }

    console.log(
      `Project found. Fetching calendar entries for project ${projectId}...`,
    );
    const calendarEntries = await tx
      .select()
      .from(projectCalendar)
      .where(eq(projectCalendar.projectId, projectId));

    console.log(`Found ${calendarEntries.length} calendar entries.`);

    let totalHours = 0;

    calendarEntries.forEach((entry, idx) => {
      console.log(`Adding hoursWorked from entry ${idx}: ${entry.hoursWorked}`);
      totalHours += entry.hoursWorked;
    });

    console.log(
      `Computed total hours worked for project ${projectId}: ${totalHours}`,
    );

    await tx
      .update(projects)
      .set({ totalHoursWorked: totalHours })
      .where(eq(projects.id, projectId));

    console.log(
      `Updated project ${projectId} totalHoursWorked to ${totalHours}`,
    );
  });
}
