"use server";

import { db } from "@/db";
import { projectFinance } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchProjectsFinances(userId: string) {
  if (!userId)
    return {
      success: false,
      data: [],
      message: `UserID required!!`,
    };

  try {
    const finances = await db
      .select()
      .from(projectFinance)
      .where(eq(projectFinance.userId, userId));

    if (finances.length === 0)
      return {
        success: false,
        data: [],
        message: `No finances found for ${userId}`,
      };

    return {
      success: true,
      data: finances,
      message: `Found ${finances.length} finances for ${userId}`,
    };
  } catch (error) {
    console.error("Fetching finances failed", error);
    return {
      success: false,
      data: [],
      message: `Fetching finances failed: ${error}`,
    };
  }
}
