"use server";

import { db } from "@/db";
import { getCurrentUser } from "../auth/getCurrentUser";
import { taxProfiles, usaTaxProfiles } from "@/db/schema";
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

  if (
    homeOfficeSqft === null ||
    homeOfficeSimplified === null ||
    mileageTracking === null ||
    healthInsuranceDeduction === null
  ) {
    return { error: "All fields are required" };
  }

  try {
    const taxProfile = await db.query.taxProfiles.findFirst({
      where: eq(taxProfiles.userId, user.id),
    });

    if (!taxProfile) {
      return { error: "Tax profile not found" };
    }

    if (taxProfile.country === "United States") {
      const usaTaxProfile = await db.query.usaTaxProfiles.findFirst({
        where: eq(usaTaxProfiles.taxProfileId, taxProfile.id),
      });
      if (!usaTaxProfile) {
        return { error: "USA tax profile not found" };
      }

      await db
        .update(usaTaxProfiles)
        .set({
          homeOfficeSqft,
          homeOfficeSimplified,
          mileageTracking,
          healthInsuranceDeduction,
        })
        .where(eq(usaTaxProfiles.id, usaTaxProfile.id));
    }

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
    revalidatePath("/onboarding?step=4");
  }
}
