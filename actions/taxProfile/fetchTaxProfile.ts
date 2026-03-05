"use server";

import { db } from "@/db";
import { taxProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchTaxProfile(userId: string) {
  if (!userId) {
    return { error: "User ID is required" };
  }

  try {
    const taxProfile = await db.query.taxProfiles.findFirst({
      where: eq(taxProfiles.userId, userId),
    });
    if (!taxProfile) {
      return { success: false, error: "Tax profile not found" };
    }
    return { success: true, taxProfile };
  } catch (error) {
    console.error("Error fetching tax profile:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching the tax profile",
    };
  }
}
