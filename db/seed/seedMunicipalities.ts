import { db } from "@/db";
import { municipalities } from "@/db/schema/taxProfileSchema";
import { municipalitiesSeed } from "@/config/constants";

export async function seedMunicipalities() {
  console.log("Seeding municipalities...");

  await db
    .insert(municipalities)
    .values(
      municipalitiesSeed.map((m) => ({
        code: m.code,
        name: m.name,
        pausalCoefficient: m.pausalCoefficient,
      })),
    )
    .onConflictDoNothing(); // if you have a unique on code

  console.log("Municipalities seeded.");
}

seedMunicipalities();
