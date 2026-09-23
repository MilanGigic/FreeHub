// import { db } from "@/db";
// import { municipalities, pausalObservations } from "@/db/schema";

// async function seedMunicipalities() {
//   await db
//     .insert(municipalities)
//     .values([
//       {
//         code: "BEOGRAD",
//         name: "Beograd",
//         city: "Beograd",
//         taxZone: 1,
//       },
//       {
//         code: "NOVI_SAD",
//         name: "Novi Sad",
//         city: "Novi Sad",
//         taxZone: 2,
//       },
//       {
//         code: "NIS",
//         name: "Niš",
//         city: "Niš",
//         taxZone: 3,
//       },
//       {
//         code: "KRUSEVAC",
//         name: "Kruševac",
//         city: "Kruševac",
//         taxZone: 4,
//       },
//     ])
//     .onConflictDoNothing();
// }

// async function seedPausalObservations() {
//   const currentYear = new Date().getFullYear();

//   await db.insert(pausalObservations).values([
//     // ─────────────────────────────────────────────
//     // SOFTWARE DEVELOPMENT — 62.01
//     // ─────────────────────────────────────────────

//     {
//       activityCode: "62.01",
//       municipalityCode: "BEOGRAD",
//       year: currentYear,
//       amountMonthly: "48500",
//       source: "admin",
//       isVerified: true,
//       confidenceScore: 95,
//       note: "APR verified solution",
//     },
//     {
//       activityCode: "62.01",
//       municipalityCode: "BEOGRAD",
//       year: currentYear,
//       amountMonthly: "49200",
//       source: "imported",
//       isVerified: true,
//       confidenceScore: 90,
//     },
//     {
//       activityCode: "62.01",
//       municipalityCode: "BEOGRAD",
//       year: currentYear,
//       amountMonthly: "47800",
//       source: "user",
//       isVerified: true,
//       confidenceScore: 88,
//     },

//     // Novi Sad

//     {
//       activityCode: "62.01",
//       municipalityCode: "NOVI_SAD",
//       year: currentYear,
//       amountMonthly: "43200",
//       source: "admin",
//       isVerified: true,
//       confidenceScore: 92,
//     },
//     {
//       activityCode: "62.01",
//       municipalityCode: "NOVI_SAD",
//       year: currentYear,
//       amountMonthly: "43900",
//       source: "user",
//       isVerified: true,
//       confidenceScore: 82,
//     },

//     // Kruševac

//     {
//       activityCode: "62.01",
//       municipalityCode: "KRUSEVAC",
//       year: currentYear,
//       amountMonthly: "35600",
//       source: "admin",
//       isVerified: true,
//       confidenceScore: 90,
//     },
//     {
//       activityCode: "62.01",
//       municipalityCode: "KRUSEVAC",
//       year: currentYear,
//       amountMonthly: "36100",
//       source: "user",
//       isVerified: true,
//       confidenceScore: 76,
//     },

//     // ─────────────────────────────────────────────
//     // DESIGN — 74.10
//     // ─────────────────────────────────────────────

//     {
//       activityCode: "74.10",
//       municipalityCode: "BEOGRAD",
//       year: currentYear,
//       amountMonthly: "39500",
//       source: "admin",
//       isVerified: true,
//       confidenceScore: 91,
//     },
//     {
//       activityCode: "74.10",
//       municipalityCode: "BEOGRAD",
//       year: currentYear,
//       amountMonthly: "40200",
//       source: "user",
//       isVerified: true,
//       confidenceScore: 70,
//     },

//     // ─────────────────────────────────────────────
//     // NOISY / BAD DATA
//     // ─────────────────────────────────────────────

//     {
//       activityCode: "62.01",
//       municipalityCode: "BEOGRAD",
//       year: currentYear,
//       amountMonthly: "180000",
//       source: "user",
//       isVerified: false,
//       confidenceScore: 10,
//       note: "Likely incorrect submission",
//     },

//     {
//       activityCode: "62.01",
//       municipalityCode: "KRUSEVAC",
//       year: currentYear,
//       amountMonthly: "5000",
//       source: "user",
//       isVerified: false,
//       confidenceScore: 5,
//       note: "Outlier test",
//     },
//   ]);
// }

// async function main() {
//   console.log("Seeding municipalities...");
//   await seedMunicipalities();

//   console.log("Seeding pausal observations...");
//   await seedPausalObservations();

//   console.log("Done.");
// }

// main()
//   .catch((err) => {
//     console.error(err);
//     process.exit(1);
//   })
//   .finally(async () => {
//     process.exit(0);
//   });
