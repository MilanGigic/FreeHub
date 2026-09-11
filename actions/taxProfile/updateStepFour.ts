// "use server";

// import { db } from "@/db";
// import { getCurrentUser } from "../auth/getCurrentUser";
// import { taxProfiles, usaTaxProfiles } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";

// export async function updateStepFour(retirementContribution: boolean) {
//   const user = await getCurrentUser();

//   if (!user) {
//     return { error: "Unauthorized" };
//   }

//   if (retirementContribution === null) {
//     return { error: "Retirement contribution is required" };
//   }

//   const profile = await db.query.taxProfiles.findFirst({
//     where: eq(taxProfiles.userId, user.id),
//   });
//   if (!profile) return { success: false, error: "Profile not found" };

//   try {
//     if (profile.country === "United States") {
//       await db
//         .update(usaTaxProfiles)
//         .set({
//           retirementContribution,
//         })
//         .where(eq(usaTaxProfiles.taxProfileId, profile.id));
//     }
//     return { success: true };
//   } catch (error) {
//     console.error("Error updating step four:", error);
//     return {
//       success: false,
//       error:
//         error instanceof Error
//           ? error.message
//           : "An error occurred while updating step four",
//     };
//   } finally {
//     revalidatePath("/dashboard");
//   }
// }
