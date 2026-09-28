"use server";

import { db } from "@/db";
import { projectFinance, projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export type ProjectFinanceWithClient = {
  projectId: string;
  clientId: string;
  type: string; // "income" | "expense"
  amount: string;
  currency: string;
  createdAt: Date;
};

export async function fetchAllClientProjectFinances(userId: string): Promise<{
  success: boolean;
  data?: ProjectFinanceWithClient[];
  error?: string;
}> {
  if (!userId) return { success: false, error: "User ID is required" };

  try {
    // Join to projects once, here, so every row already carries the
    // clientId it belongs to — no client-side projectId -> clientId
    // mapping needed downstream.
    const rows = await db
      .select({
        projectId: projectFinance.projectId,
        clientId: projects.clientId,
        type: projectFinance.type,
        amount: projectFinance.amount,
        currency: projectFinance.currency,
        createdAt: projectFinance.createdAt,
      })
      .from(projectFinance)
      .innerJoin(projects, eq(projectFinance.projectId, projects.id))
      .where(eq(projectFinance.userId, userId));

    return { success: true, data: rows };
  } catch (error) {
    console.error("Error fetching project finances:", error);
    return {
      success: false,
      error: "An error occurred while fetching project finances",
    };
  }
}
