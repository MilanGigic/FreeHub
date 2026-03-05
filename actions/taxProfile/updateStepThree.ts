"use server";

import { db } from "@/db";
import { getCurrentUser } from "../auth/getCurrentUser";
import { taxProfiles } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function updateStepThree(
  homeOfficeSqft: number | null,
  homeOfficeSimplified: boolean | null,
  mileageTracking: boolean | null,
  healthInsuranceDeduction: boolean | null,
) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  console.log(
    "Fields:",
    homeOfficeSqft,
    homeOfficeSimplified,
    mileageTracking,
    healthInsuranceDeduction,
  );

  if (
    homeOfficeSqft === null ||
    homeOfficeSimplified === null ||
    mileageTracking === null ||
    healthInsuranceDeduction === null
  ) {
    return { error: "All fields are required" };
  }

  try {
    await db
      .update(taxProfiles)
      .set({
        userId: user.id,
        homeOfficeSqft,
        homeOfficeSimplified,
        mileageTracking,
        healthInsuranceDeduction,
      })
      .where(eq(taxProfiles.userId, user.id));

    return { success: true };
  } catch (error) {
    console.error("Error updating step three:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while updating step three",
    };
  } finally {
    revalidatePath("/dashboard?wizard=true&step=4");
  }
}
