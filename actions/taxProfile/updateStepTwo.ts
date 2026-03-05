"use server";

import { taxProfiles } from "@/db/schema";
import { getCurrentUser } from "../auth/getCurrentUser";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function updateStepTwo(
  filingStatus: string,
  stateResidence: string,
) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!filingStatus || !stateResidence) {
    return { error: "Filing status and state residence are required" };
  }

  try {
    await db
      .update(taxProfiles)
      .set({
        userId: user.id,
        filingStatus,
        stateResidence,
      })
      .where(eq(taxProfiles.userId, user.id));

    return { success: true };
  } catch (error) {
    console.error("Error updating step two:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while updating step two",
    };
  } finally {
    revalidatePath("/dashboard?wizard=true&step=3");
  }
}
