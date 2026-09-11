"use server";

import { db } from "@/db";
import { getCurrentUser } from "../auth/getCurrentUser";
import { taxProfileSerbia, taxProfile, taxProfileUsa } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

type UpdateStepThreeInput = {
  // USA
  homeOfficeSqft?: number;
  homeOfficeSimplified?: boolean;
  mileageTracking?: boolean;
  healthInsuranceDeduction?: boolean;

  // Serbia (shared)
  isUnder40?: boolean;
  activeMonths?: number; // 1–12
  numberOfClients?: number;
  estimatedAnnualGross?: number;

  // Serbia - Pausal
  pausalMunicipality?: string;
  pausalEmployeeCount?: number;

  // Serbia - Knjigas
  paysPersonalSalary?: boolean;
  personalSalaryAmount?: number;
};

export async function updateStepThree(input: UpdateStepThreeInput) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const profile = await db.query.taxProfile.findFirst({
      where: eq(taxProfile.userId, user.id),
    });
    if (!profile) return { success: false, error: "Tax profile not found" };

    // ---------------- USA ----------------
    // if (profile.country === "US") {
    //   const {
    //     homeOfficeSqft,
    //     homeOfficeSimplified,
    //     mileageTracking,
    //     healthInsuranceDeduction,
    //   } = input;

    //   if (
    //     typeof homeOfficeSqft !== "number" ||
    //     typeof homeOfficeSimplified !== "boolean" ||
    //     typeof mileageTracking !== "boolean" ||
    //     typeof healthInsuranceDeduction !== "boolean"
    //   ) {
    //     return {
    //       success: false,
    //       error:
    //         "homeOfficeSqft, homeOfficeSimplified, mileageTracking, and healthInsuranceDeduction are required",
    //     };
    //   }

    //   const usaTaxProfile = await db.query.taxProfileUsa.findFirst({
    //     where: eq(taxProfileUsa.taxProfileId, taxProfile.id),
    //   });
    //   if (!usaTaxProfile)
    //     return { success: false, error: "USA tax profile not found" };

    //   await db
    //     .update(taxProfileUsa)
    //     .set({
    //       homeOfficeSqft,
    //       mileageTracking,
    //       healthInsuranceDeduction,
    //     })
    //     .where(eq(taxProfileUsa.id, usaTaxProfile.id));
    // }

    // ---------------- SERBIA ----------------
    if (profile.country === "RS") {
      const serbiaTaxProfile = await db.query.taxProfileSerbia.findFirst({
        where: eq(taxProfileSerbia.taxProfileId, taxProfile.id),
      });
      if (!serbiaTaxProfile)
        return { success: false, error: "Serbia tax profile not found" };

      const updateData: Partial<typeof taxProfileSerbia.$inferInsert> = {};

      // Shared fields for SRB step three (applied regardless of regime if provided)

      if (Object.keys(updateData).length > 0) {
        await db
          .update(taxProfileSerbia)
          .set(updateData)
          .where(eq(taxProfileSerbia.taxProfileId, taxProfile.id));
      }
    }

    revalidatePath("/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Error updating step three:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
