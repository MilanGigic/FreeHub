"use server";

import { db } from "@/db";
import { getCurrentUser } from "../auth/getCurrentUser";
import { CountryTaxProfile, getTaxProfile } from "../taxProfile";
import { and, eq } from "drizzle-orm";
import { taxProfileSerbia } from "@/db/schema";

export async function updateIndependenceTest(
  score: number,
  calculatedAt: Date,
) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "User not found.",
    };
  }

  if (!score || !calculatedAt) {
    return {
      success: false,
      message: "Both Score and date of completion are required",
    };
  }

  try {
    const res: CountryTaxProfile = await getTaxProfile(user.id);

    if (!res) {
      return {
        success: false,
        message: `Tax profile not found for user: ${user.id}`,
      };
    }

    if (res.country === "Serbia") {
      const dbProfile = await db.query.taxProfileSerbia.findFirst({
        where: eq(taxProfileSerbia.id, res.id),
      });

      if (dbProfile) {
        const [newProfile] = await db
          .update(taxProfileSerbia)
          .set({
            independenceTestScore: score,
            independenceTestCalculatedAt: calculatedAt,
          })
          .where(and(eq(taxProfileSerbia.id, res.id)))
          .returning();

        return {
          success: true,
          message: `Tax profile updated for ${dbProfile.id}`,
          data: newProfile,
        };
      } else {
        return {
          success: false,
          message: "No such profile found in database...",
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error as string,
    };
  }
}
