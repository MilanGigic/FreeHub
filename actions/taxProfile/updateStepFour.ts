"use server";

import { db } from "@/db";
import { getCurrentUser } from "../auth/getCurrentUser";
import { taxProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateStepFour(retirementContribution: boolean) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (retirementContribution === null) {
    return { error: "Retirement contribution is required" };
  }

  try {
    await db
      .update(taxProfiles)
      .set({
        retirementContribution,
      })
      .where(eq(taxProfiles.userId, user.id));

    return { success: true };
  } catch (error) {
    console.error("Error updating step four:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while updating step four",
    };
  } finally {
    revalidatePath("/dashboard?wizard=true&step=5");
  }
}
