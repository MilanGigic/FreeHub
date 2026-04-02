"use server";

import { db } from "@/db";
import { taxProfiles, usaTaxProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function getTaxProfile() {
  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthenticated");

  const profile = await db.query.taxProfiles.findFirst({
    where: eq(taxProfiles.userId, session.userId),
  });
  return profile ?? null;
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
