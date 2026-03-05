"use server";

import { db } from "@/db";
import { taxProfiles } from "@/db/schema";
import { getCurrentUser } from "../auth/getCurrentUser";

export async function updateStepOne(businessStructure: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!businessStructure) {
    return { error: "Business structure is required" };
  }

  try {
    await db.insert(taxProfiles).values({
      userId: user.id,
      entityType: businessStructure,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating step one:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while updating step one",
    };
  }
}
