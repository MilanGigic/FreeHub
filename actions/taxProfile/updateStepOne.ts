"use server";

import { db } from "@/db";
import { serbiaTaxProfiles, taxProfiles, usaTaxProfiles } from "@/db/schema";
import { getCurrentUser } from "../auth/getCurrentUser";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateStepOne(businessStructure: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false as const, error: "Unauthorized" };
  }

  if (!businessStructure) {
    return { success: false as const, error: "Business structure is required" };
  }

  try {
    const taxProfile = await db.query.taxProfiles.findFirst({
      where: eq(taxProfiles.userId, user.id),
    });

    if (!taxProfile) {
      return { success: false as const, error: "Tax profile not found" };
    }

    // ---------------- USA ----------------
    if (taxProfile.country === "United States") {
      await db
        .insert(usaTaxProfiles)
        .values({ taxProfileId: taxProfile.id, entityType: businessStructure })
        .onConflictDoUpdate({
          target: usaTaxProfiles.taxProfileId,
          set: { entityType: businessStructure },
        });
    }

    // ---------------- SERBIA ----------------
    if (taxProfile.country === "Serbia") {
      await db
        .insert(serbiaTaxProfiles)
        .values({ taxProfileId: taxProfile.id, regime: businessStructure })
        .onConflictDoUpdate({
          target: serbiaTaxProfiles.taxProfileId,
          set: { regime: businessStructure },
        });
    }

    revalidatePath("/onboarding");
    return { success: true as const };
  } catch (error) {
    console.error("Error updating step one:", error);
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while updating step one",
    };
  }
}
