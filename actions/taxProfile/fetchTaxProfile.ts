"use server";

import { db } from "@/db";
import { taxProfile, taxProfileSerbia, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface TaxProfileOutput {
  profileId: string;
  email: string;
  userName: string;
  country: string;
  hasCompletedTaxOnboarding: boolean | null;
  profileCreatedAt: Date;
  profileUpdatedAt: Date;
  taxProfileId: string;
  taxProfileCountry: "RS" | "US";
  taxProfileCreatedAt: Date;
  taxProfileUpdatedAt: Date;
  taxResidency: "resident" | "non_resident" | "unknown";
  isUnder40: boolean;
  primaryHealthInsuredElsewhere: boolean;
  alreadyEmployed: boolean;
  countryTaxProfileId: string;
  currentRegime:
    | "freelancer"
    | "pausal"
    | "knjigas"
    | "d.o.o."
    | "employee"
    | "hybrid";
  preferredFrilenserModel: "A" | "B" | null;
  activityCode: string | null;
  municipalityId: string | null;
  officialPausalMonthlyAmount: string | null;
  pausalResenjeDate: Date | null;
  pausalResenjeDocumentUrl: string | null;
  personalSalaryElected: boolean | null;
  personalSalaryGrossMonthly: string | null;
  vatRegistered: boolean;
  vatRegistrationDate: Date | null;
  estimatedAnnualGross: string;
  notes: string | null;
}

export async function fetchTaxProfile(
  userId: string,
): Promise<TaxProfileOutput> {
  "use cache";
  cacheLife("hours");
  cacheTag("tax-profile", `tax-${userId}`);

  if (!userId) throw new Error("UserID required!");

  const profile = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!profile) throw new Error("Profile not found!");

  const tax = await db.query.taxProfile.findFirst({
    where: eq(taxProfile.userId, profile.id),
  });

  if (!tax) throw new Error("Tax profile not found!");

  const countryTax = await db.query.taxProfileSerbia.findFirst({
    where: eq(taxProfileSerbia.taxProfileId, tax.id),
  });

  if (!countryTax) throw new Error("Country Tax profile not found!");

  return {
    profileId: profile.id,
    email: profile.email,
    userName: profile.userName,
    country: profile.country,
    hasCompletedTaxOnboarding: profile.hasCompletedTaxOnboarding,
    profileCreatedAt: profile.createdAt,
    profileUpdatedAt: profile.updatedAt,
    taxProfileId: tax.id,
    taxProfileCountry: tax.country,
    taxProfileCreatedAt: tax.createdAt,
    taxProfileUpdatedAt: tax.updatedAt,
    taxResidency: tax.taxResidency,
    isUnder40: tax.isUnder40,
    primaryHealthInsuredElsewhere: tax.primaryHealthInsuredElsewhere,
    alreadyEmployed: tax.alreadyEmployed,
    countryTaxProfileId: countryTax.id,
    currentRegime: countryTax.currentRegime,
    preferredFrilenserModel: countryTax.preferredFrilenserModel,
    activityCode: countryTax.activityCode,
    municipalityId: countryTax.municipalityId,
    officialPausalMonthlyAmount: countryTax.officialPausalMonthlyAmount,
    pausalResenjeDate: countryTax.pausalResenjeDate,
    pausalResenjeDocumentUrl: countryTax.pausalResenjeDocumentUrl,
    personalSalaryElected: countryTax.personalSalaryElected,
    personalSalaryGrossMonthly: countryTax.personalSalaryGrossMonthly,
    vatRegistered: countryTax.vatRegistered,
    vatRegistrationDate: countryTax.vatRegistrationDate,
    estimatedAnnualGross: countryTax.estimatedAnnualGross,
    notes: countryTax.notes,
  };
}
