"use server";

import { db } from "@/db";
import { taxProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function getTaxProfile() {
  const session = await getSession();
  if (!session?.userId) throw new Error("Unauthenticated");

  const [profile] = await db
    .select()
    .from(taxProfiles)
    .where(eq(taxProfiles.userId, session.userId))
    .limit(1);

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

  await db
    .insert(taxProfiles)
    .values({ userId: session.userId, ...data })
    .onConflictDoUpdate({
      target: taxProfiles.userId,
      set: data,
    });
}
