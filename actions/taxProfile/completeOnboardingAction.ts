"use server";

import { db } from "@/db";
import {
  municipalities,
  taxProfile,
  taxProfileSerbia,
  users,
} from "@/db/schema";
import { getSession } from "@/lib/session";
import {
  mapOnboardingToProfile,
  OnboardingData,
} from "@/lib/tax/mapOnboardingToProfile";
import { eq } from "drizzle-orm";

export async function completeOnboardingAction(onboardingData: OnboardingData) {
  const session = await getSession();

  if (!session?.userId) throw new Error("Not authenticated");

  const mapped = mapOnboardingToProfile(onboardingData);

  const [profile] = await db
    .insert(taxProfile)
    .values({
      userId: session.userId,
      country: mapped.base.country,
      taxResidency: mapped.base.taxResidency,
      isUnder40: mapped.base.isUnder40,
      primaryHealthInsuredElsewhere: mapped.base.primaryHealthInsuredElsewhere,
      alreadyEmployed: mapped.base.alreadyEmployed,
    })
    .onConflictDoUpdate({
      target: taxProfile.userId,
      set: {
        country: mapped.base.country,
        taxResidency: mapped.base.taxResidency,
        isUnder40: mapped.base.isUnder40,
        primaryHealthInsuredElsewhere:
          mapped.base.primaryHealthInsuredElsewhere,
        alreadyEmployed: mapped.base.alreadyEmployed,
        updatedAt: new Date(),
      },
    })
    .returning();

  if (!profile) {
    throw new Error("Failed to create tax profile");
  }

  if (mapped.serbia) {
    if (!mapped.serbia.currentRegime) {
      throw new Error("A tax regime must be selected to complete onboarding.");
    }

    const municipalityId = await db.query.municipalities.findFirst({
      where: eq(municipalities.name, mapped.serbia.municipality!),
    });
    await db.insert(taxProfileSerbia).values({
      taxProfileId: profile.id,
      currentRegime: mapped.serbia.currentRegime as
        | "freelancer"
        | "pausal"
        | "knjigas"
        | "d.o.o."
        | "employee"
        | "hybrid",
      preferredFrilenserModel: mapped.serbia.preferredFrilenserModel as
        | "A"
        | "B"
        | null,
      activityCode: mapped.serbia.activityCode, // now narrowed to `string` by the guard above
      municipalityId: municipalityId ? municipalityId.id : null,
      officialPausalMonthlyAmount:
        mapped.serbia.officialPausalMonthlyAmount?.toString() ?? null,
      personalSalaryElected: mapped.serbia.personalSalaryElected,
      personalSalaryGrossMonthly:
        mapped.serbia.personalSalaryGrossMonthly?.toString() ?? null,
      vatRegistered: mapped.serbia.vatRegistered!,
      vatRegistrationDate: mapped.serbia.vatRegistrationDate
        ? new Date(mapped.serbia.vatRegistrationDate)
        : null,
      pausalResenjeDate: mapped.serbia.resenjeDate
        ? new Date(mapped.serbia.resenjeDate)
        : null,
      estimatedAnnualGross: mapped.serbia.estimatedAnnualGross!.toString(),
      pausalResenjeDocumentUrl: "",
      notes: "",
    });
  }

  await db
    .update(users)
    .set({ hasCompletedTaxOnboarding: true })
    .where(eq(users.id, profile.userId!));

  return { success: true, taxProfileId: profile.id };
}
