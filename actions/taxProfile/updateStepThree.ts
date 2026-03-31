"use server";

import { db } from "@/db";
import { getCurrentUser } from "../auth/getCurrentUser";
import { serbiaTaxProfiles, taxProfiles, usaTaxProfiles } from "@/db/schema";
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
    const taxProfile = await db.query.taxProfiles.findFirst({
      where: eq(taxProfiles.userId, user.id),
    });
    if (!taxProfile) return { success: false, error: "Tax profile not found" };

    // ---------------- USA ----------------
    if (taxProfile.country === "United States") {
      const {
        homeOfficeSqft,
        homeOfficeSimplified,
        mileageTracking,
        healthInsuranceDeduction,
      } = input;

      if (
        typeof homeOfficeSqft !== "number" ||
        typeof homeOfficeSimplified !== "boolean" ||
        typeof mileageTracking !== "boolean" ||
        typeof healthInsuranceDeduction !== "boolean"
      ) {
        return {
          success: false,
          error:
            "homeOfficeSqft, homeOfficeSimplified, mileageTracking, and healthInsuranceDeduction are required",
        };
      }

      const usaTaxProfile = await db.query.usaTaxProfiles.findFirst({
        where: eq(usaTaxProfiles.taxProfileId, taxProfile.id),
      });
      if (!usaTaxProfile)
        return { success: false, error: "USA tax profile not found" };

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

    // ---------------- SERBIA ----------------
    if (taxProfile.country === "Serbia") {
      const serbiaTaxProfile = await db.query.serbiaTaxProfiles.findFirst({
        where: eq(serbiaTaxProfiles.taxProfileId, taxProfile.id),
      });
      if (!serbiaTaxProfile)
        return { success: false, error: "Serbia tax profile not found" };

      const updateData: Partial<typeof serbiaTaxProfiles.$inferInsert> = {};

      // Shared fields for SRB step three (applied regardless of regime if provided)
      if (typeof input.isUnder40 === "boolean") {
        updateData.isUnder40 = input.isUnder40;
      }
      if (typeof input.activeMonths === "number") {
        updateData.activeMonths = input.activeMonths;
      }
      if (typeof input.numberOfClients === "number") {
        updateData.numberOfClients = input.numberOfClients;
      }
      if (typeof input.estimatedAnnualGross === "number") {
        updateData.estimatedAnnualGross = String(input.estimatedAnnualGross);
      }

      // ---------- PAUSAL ----------
      if (serbiaTaxProfile.regime === "pausal") {
        if (typeof input.pausalMunicipality === "string") {
          updateData.pausalMunicipality = input.pausalMunicipality;
        }
        if (typeof input.pausalEmployeeCount === "number") {
          updateData.pausalEmployeeCount = input.pausalEmployeeCount;
        }
      }

      // ---------- KNJIGAS ----------
      if (serbiaTaxProfile.regime === "knjigas") {
        if (typeof input.paysPersonalSalary === "boolean") {
          updateData.paysPersonalSalary = input.paysPersonalSalary;
        }
        if (typeof input.personalSalaryAmount === "number") {
          updateData.personalSalaryAmount = String(input.personalSalaryAmount);
        }
      }

      if (Object.keys(updateData).length > 0) {
        await db
          .update(serbiaTaxProfiles)
          .set(updateData)
          .where(eq(serbiaTaxProfiles.taxProfileId, taxProfile.id));
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
