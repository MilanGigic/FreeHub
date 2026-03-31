"use server";

import { db } from "@/db";
import { serbiaTaxProfiles, taxProfiles, usaTaxProfiles } from "@/db/schema";
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

    // Merge country-specific fields into the base profile.
    if (taxProfile.country === "United States") {
      const usa = await db.query.usaTaxProfiles.findFirst({
        where: eq(usaTaxProfiles.taxProfileId, taxProfile.id),
      });
      return { success: true, taxProfile: { ...taxProfile, ...(usa ?? {}) } };
    }

    if (taxProfile.country === "Serbia") {
      const srb = await db.query.serbiaTaxProfiles.findFirst({
        where: eq(serbiaTaxProfiles.taxProfileId, taxProfile.id),
      });
      return { success: true, taxProfile: { ...taxProfile, ...(srb ?? {}) } };
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
