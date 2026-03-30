import { db } from "@/db";
import { municipalities } from "@/db/schema/taxProfileSchema";
import { MUNICIPALITIES } from "@/config/constants";

export async function seedMunicipalities() {
  console.log("Seeding municipalities...");

  await db
    .insert(municipalities)
    .values(
      MUNICIPALITIES.map((m) => ({
        code: m.code,
        name: m.name,
        city: m.city ?? null,
        taxZone: null, // fill later when you add tax logic
      })),
    )
    .onConflictDoNothing();

  console.log("Municipalities seeded.");
}
