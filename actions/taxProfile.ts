"use server";

import { db } from "@/db";
import { taxProfile, taxProfileSerbia, taxProfileUsa } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export type UsaTaxProfile = typeof taxProfileUsa.$inferSelect & {
  userId: string;
  country: "United States";
  createdAt: Date;
  updatedAt: Date | null;
};

export type SerbiaTaxProfile = typeof taxProfileSerbia.$inferSelect & {
  userId: string;
  country: "Serbia";
  createdAt: Date;
  updatedAt: Date | null;
};

export type CountryTaxProfile = UsaTaxProfile | SerbiaTaxProfile | null;

export async function getTaxProfile(
  userId: string,
): Promise<CountryTaxProfile> {
  if (!userId) throw new Error("User ID is required");

  const base = await db.query.taxProfile.findFirst({
    where: eq(taxProfile.userId, userId),
  });
  if (!base) return null;

  if (base.country === "US") {
    const usaProfile = await db.query.taxProfileUsa.findFirst({
      where: eq(taxProfileUsa.taxProfileId, base.id),
    });
    if (!usaProfile || base.userId === null) return null;

    return {
      ...usaProfile,
      userId: base.userId,
      country: "United States" as const,
      createdAt: base.createdAt,
      updatedAt: base.updatedAt,
    };
  }

  if (base.country === "RS") {
    const srbProfile = await db.query.taxProfileSerbia.findFirst({
      where: eq(taxProfileSerbia.taxProfileId, base.id),
    });
    if (!srbProfile || base.userId === null) return null;

    return {
      ...srbProfile,
      userId: base.userId,
      country: "Serbia" as const,
      createdAt: base.createdAt,
      updatedAt: base.updatedAt,
    };
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

  const profile = await db.query.taxProfile.findFirst({
    where: eq(taxProfile.userId, session.userId),
  });

  if (!profile) return { success: false, error: "Profile not found" };

  // if (profile.country === "US") {
  //   await db
  //     .insert(taxProfileUsa)
  //     .values({ taxProfileId: profile.id, ...data })
  //     .onConflictDoUpdate({
  //       target: taxProfileUsa.taxProfileId,
  //       set: data,
  //     });
  // }

  return { success: true };
}
