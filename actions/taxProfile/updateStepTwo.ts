// "use server";

// import { taxProfileSerbia, taxProfile, taxProfileUsa } from "@/db/schema";
// import { getCurrentUser } from "../auth/getCurrentUser";
// import { db } from "@/db";
// import { revalidatePath } from "next/cache";
// import { eq } from "drizzle-orm";

// type UpdateStepTwoInput = {
//   // USA
//   filingStatus?: string;
//   stateResidence?: string;
//   // Serbia - Frilenser
//   model?: string;
//   healthInsuredElsewhere?: boolean;
//   // Serbia - Pausal
//   pausalActivityCode?: string;
//   pausalMunicipality?: string;
//   // Serbia - Knjigas
//   businessModel?: string;
// };

// export async function updateStepTwo(input: UpdateStepTwoInput) {
//   const user = await getCurrentUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   try {
//     const profile = await db.query.taxProfile.findFirst({
//       where: eq(taxProfile.userId, user.id),
//     });
//     if (!profile) return { success: false, error: "Tax profile not found" };

//     // ---------------- USA ----------------
//     // if (profile.country === "United States") {
//     //   const { filingStatus, stateResidence } = input;
//     //   if (!filingStatus || !stateResidence) {
//     //     return {
//     //       success: false,
//     //       error: "Filing status and state residence are required",
//     //     };
//     //   }

//     //   const usaTaxProfile = await db.query.taxProfileUsa.findFirst({
//     //     where: eq(taxProfileUsa.taxProfileId, taxProfile.id),
//     //   });
//     //   if (!usaTaxProfile)
//     //     return { success: false, error: "USA tax profile not found" };

//     //   await db
//     //     .update(taxProfileUsa)
//     //     .set({ filingStatus, stateResidence })
//     //     .where(eq(taxProfileUsa.id, usaTaxProfile.id));
//     // }

//     // ---------------- SERBIA ----------------
//     if (profile.country === "RS") {
//       const serbiaTaxProfile = await db.query.taxProfileSerbia.findFirst({
//         where: eq(taxProfileSerbia.taxProfileId, profile.id),
//       });
//       if (!serbiaTaxProfile)
//         return { success: false, error: "Serbia tax profile not found" };

//       const updateData: Partial<typeof taxProfileSerbia.$inferInsert> = {};

//       // ---------- FRILENSER ----------
//       if (serbiaTaxProfile.regime === "frilenser") {
//         if (input.model) {
//           updateData.preferredModel = input.model;
//         }
//         if (typeof input.healthInsuredElsewhere === "boolean") {
//           updateData.healthInsuredElsewhere = input.healthInsuredElsewhere;
//         }
//       }

//       // ---------- PAUSAL ----------
//       if (serbiaTaxProfile.regime === "pausal") {
//         if (input.pausalActivityCode) {
//           updateData.pausalActivityCode = input.pausalActivityCode;
//         }
//       }

//       // ---------- KNJIGAS ----------
//       if (serbiaTaxProfile.regime === "knjigas") {
//         if (input.businessModel) {
//           updateData.businessModel = input.businessModel;
//         }
//       }

//       if (Object.keys(updateData).length > 0) {
//         await db
//           .update(taxProfileSerbia)
//           .set(updateData)
//           .where(eq(taxProfileSerbia.taxProfileId, taxProfile.id));
//       }
//     }

//     revalidatePath("/onboarding");
//     return { success: true };
//   } catch (error) {
//     console.error("Error updating step two:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error occurred",
//     };
//   }
// }
