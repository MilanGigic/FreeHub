"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";

export async function calculateTotalRevenue() {
  try {
    const data = await db.select().from(projects);
    const totalRevenue = data.reduce(
      (acc, project) => acc + Number(project.totalRevenue || 0),
      0,
    );
    return { success: true, data: totalRevenue };
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    return {
      success: false,
      error: "An error occurred while calculating total revenue",
    };
  }
}
