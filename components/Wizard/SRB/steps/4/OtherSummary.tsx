// import { TaxProfile } from "@/types/types";
// import {
//   ClipboardList,
//   Building2,
//   Wallet,
//   Users,
//   ShieldCheck,
//   AlertTriangle,
// } from "lucide-react";
// import InfoRow from "./InfoRow";
// import { fmt, regimeLabel, businessModelLabel } from "./helpers";
// import ScoreBadge from "./ScoreBadge";
// import SummaryCard from "./SummaryCard";

// export default function OtherSummary({ p }: { p: TaxProfile }) {
//   return (
//     <div className="w-full max-w-md flex flex-col gap-4">
//       <SummaryCard
//         title="Vaš profil"
//         number="01"
//         icon={<ClipboardList size={15} />}
//       >
//         <InfoRow
//           icon={<Building2 size={15} />}
//           label="Režim"
//           value={regimeLabel[p.regime ?? ""] ?? "—"}
//         />
//         {p.regime === "pausal" && (
//           <>
//             <InfoRow
//               icon={<ClipboardList size={15} />}
//               label="Šifra delatnosti"
//               value={p.pausalActivityCode ?? "—"}
//             />
//             <InfoRow
//               icon={<Building2 size={15} />}
//               label="Opština"
//               value={p.pausalMunicipality ?? "—"}
//             />
//             <InfoRow
//               icon={<Wallet size={15} />}
//               label="Mesečni paušal"
//               value={fmt(p.monthlyPausalTax)}
//             />
//             <InfoRow
//               icon={<Users size={15} />}
//               label="Broj zaposlenih"
//               value={p.pausalEmployeeCount ?? "—"}
//             />
//           </>
//         )}
//         {p.regime === "knjigas" && (
//           <>
//             <InfoRow
//               icon={<Building2 size={15} />}
//               label="Model poslovanja"
//               value={businessModelLabel[p.businessModel ?? ""] ?? "—"}
//             />
//             <InfoRow
//               icon={<Wallet size={15} />}
//               label="Lična zarada"
//               value={
//                 p.paysPersonalSalary
//                   ? fmt(p.personalSalaryAmount)
//                   : "Ne isplaćuje"
//               }
//             />
//             <InfoRow
//               icon={<ShieldCheck size={15} />}
//               label="PDV sistem"
//               value={
//                 p.isInVatSystem ? "U sistemu PDV-a" : "Nije u sistemu PDV-a"
//               }
//             />
//             {p.vatThresholdWarning && (
//               <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-lg bg-(--accent-red)/10 border border-(--accent-red)">
//                 <AlertTriangle
//                   size={13}
//                   className="text-(--accent-red) shrink-0"
//                 />
//                 <span className="text-xs text-(--accent-red) font-medium">
//                   Bliži se prag za PDV registraciju
//                 </span>
//               </div>
//             )}
//           </>
//         )}
//         <InfoRow
//           icon={<Wallet size={15} />}
//           label="Procenjeni godišnji prihod"
//           value={fmt(p.estimatedAnnualGross)}
//         />
//       </SummaryCard>

//       {p.independenceTestScore !== null &&
//         p.independenceTestScore !== undefined && (
//           <SummaryCard
//             title="Test nezavisnosti"
//             number="02"
//             icon={<ShieldCheck size={15} />}
//           >
//             <div className="pt-1 pb-0.5">
//               <ScoreBadge score={p.independenceTestScore} />
//             </div>
//             {p.independenceTestScore >= 5 && (
//               <p className="text-xs text-primary opacity-50 leading-relaxed mt-2">
//                 Vaši odgovori ukazuju na moguć zavisni radni odnos.
//                 Preporučujemo konsultaciju sa poreskim savetnikom.
//               </p>
//             )}
//           </SummaryCard>
//         )}
//     </div>
//   );
// }
