// "use server";

// import { db } from "@/db";
// import { getCurrentUser } from "../auth/getCurrentUser";
// import { eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";
// import { taxProfile, taxProfileSerbia, taxProfileUsa } from "@/db/schema";

// export async function updateStepOne(country: string, taxResident: boolean) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return { success: false as const, error: "Unauthorized" };
//   }

//   if (!country && taxResident === null) {
//     return { success: false as const, error: "Business structure is required" };
//   }

//   try {
//     const tax = await db.query.taxProfile.findFirst({
//       where: eq(taxProfile.userId, user.id),
//     });

//     if (!tax) {
//       return { success: false as const, error: "Tax profile not found" };
//     }

//     // ---------------- USA ----------------
//     // if (tax.country === "US") {
//     //   await db
//     //     .insert(taxProfileUsa)
//     //     .values({ taxProfileId: taxProfile.id, entityType: businessStructure })
//     //     .onConflictDoUpdate({
//     //       target: usaTaxProfiles.taxProfileId,
//     //       set: { entityType: businessStructure },
//     //     });
//     // }

//     // ---------------- SERBIA ----------------
//     if (tax.country === "RS") {
//       await db
//         .insert(taxProfileSerbia)
//         .values({ taxProfileId: taxProfile.id, regime: businessStructure })
//         .onConflictDoUpdate({
//           target: serbiaTaxProfiles.taxProfileId,
//           set: { regime: businessStructure },
//         });
//     }

//     revalidatePath("/onboarding");
//     return { success: true as const };
//   } catch (error) {
//     console.error("Error updating step one:", error);
//     return {
//       success: false as const,
//       error:
//         error instanceof Error
//           ? error.message
//           : "An error occurred while updating step one",
//     };
//   }
// }
