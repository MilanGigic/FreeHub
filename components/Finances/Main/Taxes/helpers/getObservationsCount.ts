"use server";

import { db } from "@/db";
import { pausalObservations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getObservationsCount() {
  try {
    const data = await db
      .select()
      .from(pausalObservations)
      .where(eq(pausalObservations.isVerified, true));

    return data;
  } catch (error) {
    throw new Error(error as string);
  }
}
