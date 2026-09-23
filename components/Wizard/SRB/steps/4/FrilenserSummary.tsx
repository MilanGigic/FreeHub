// import {
//   Building2,
//   Calendar,
//   ClipboardList,
//   ShieldCheck,
//   Users,
//   Wallet,
// } from "lucide-react";
// import InfoRow from "./InfoRow";
// import { fmt, modelLabel, regimeLabel } from "./helpers";
// import { TaxProfile } from "@/types/types";
// import SummaryCard from "./SummaryCard";

// export default function FrilenserSummary({ p }: { p: TaxProfile }) {
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
//         <InfoRow
//           icon={<Wallet size={15} />}
//           label="Model oporezivanja"
//           value={p.preferredModel ? modelLabel[p.preferredModel] : "—"}
//         />
//         <InfoRow
//           icon={<Calendar size={15} />}
//           label="Aktivnih meseci"
//           value={p.activeMonths ? `${p.activeMonths} mes.` : "—"}
//         />
//         <InfoRow
//           icon={<Users size={15} />}
//           label="Broj klijenata"
//           value={p.numberOfClients ?? "—"}
//         />
//         <InfoRow
//           icon={<Wallet size={15} />}
//           label="Iznos iz poslednjeg kvartala"
//           value={fmt(p.estimatedAnnualGross)}
//         />
//         <InfoRow
//           icon={<ShieldCheck size={15} />}
//           label="Starost"
//           value={p.isUnder40 ? "Ispod 40 godina" : "40 ili više"}
//         />
//         <InfoRow
//           icon={<ShieldCheck size={15} />}
//           label="Zdravstveno drugde"
//           value={p.healthInsuredElsewhere ? "Da" : "Ne"}
//         />
//       </SummaryCard>
//     </div>
//   );
// }
