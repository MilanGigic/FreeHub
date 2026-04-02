"use server";

import { db } from "@/db";
import { serbiaTaxProfiles, taxProfiles, usaTaxProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export type UsaTaxProfile = typeof usaTaxProfiles.$inferSelect & {
  country: "United States";
};

export type SerbiaTaxProfile = typeof serbiaTaxProfiles.$inferSelect & {
  country: "Serbia";
};

export type CountryTaxProfile = UsaTaxProfile | SerbiaTaxProfile | null;

export async function getTaxProfile(
  userId: string,
): Promise<CountryTaxProfile> {
  if (!userId) throw new Error("User ID is required");
  const base = await db.query.taxProfiles.findFirst({
    where: eq(taxProfiles.userId, userId),
  });
  if (!base) return null;

  if (base.country === "United States") {
    const usaProfile = await db.query.usaTaxProfiles.findFirst({
      where: eq(usaTaxProfiles.taxProfileId, base.id),
    });
    return usaProfile ? { ...usaProfile, country: "United States" } : null;
  }

  if (base.country === "Serbia") {
    const srbProfile = await db.query.serbiaTaxProfiles.findFirst({
      where: eq(serbiaTaxProfiles.taxProfileId, base.id),
    });
    return srbProfile ? { ...srbProfile, country: "Serbia" } : null;
  }

  return null;
}

export async function upsertTaxProfile(data: {
  entityType: string | null;
  filingStatus: string | null;
  stateResidence: string;
  homeOfficeSqft: number | null;
  homeOfficeSimplified: boolean;
  mileageTracking: boolean;
  healthInsuranceDeduction: boolean;
  estimatedAnnualGross: number | null;
}) {
  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthenticated");

  const profile = await db.query.taxProfiles.findFirst({
    where: eq(taxProfiles.userId, session.userId),
  });

  if (!profile) return { success: false, error: "Profile not found" };

  if (profile.country === "United States") {
    await db
      .insert(usaTaxProfiles)
      .values({ taxProfileId: profile.id, ...data })
      .onConflictDoUpdate({
        target: usaTaxProfiles.taxProfileId,
        set: data,
      });
  }

  return { success: true };
}
