"use client";
import { useWizardStore } from "@/lib/store/useWizardStore";
import { MouseEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Freelancer from "./Freelancer";
import Pausal from "./Pausal";
import Knjigas from "./Knjigas";
import Doo from "./Doo";
import Employee from "./Employee";
import Hybrid from "./Hybrid";
import WizardNavigationButtons from "@/components/Wizard/WizardNavigationButtons";

// function IndependencePrompt({
//   onYes,
//   onNo,
// }: {
//   onYes: () => void;
//   onNo: () => void;
// }) {
//   return (
//     <div className="w-full max-w-md bg-(--background-elevated) border border-(--background-border) rounded-2xl p-6 flex flex-col gap-4">
//       <div className="flex items-center gap-3">
//         <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
//           01
//         </span>
//         <ShieldCheck size={15} className="text-(--accent-cyan) opacity-70" />
//         <h2 className="text-primary text-base font-semibold">
//           Test nezavisnosti
//         </h2>
//       </div>

//       <p className="text-sm text-primary opacity-60 leading-relaxed">
//         Test nezavisnosti utvrđuje da li vaš odnos sa klijentom može biti
//         okarakterisan kao zavisni radni odnos — što direktno utiče na vaše
//         poreske obaveze.
//       </p>

//       <div className="flex gap-3 w-full">
//         <button
//           onClick={onYes}
//           className="flex-1 py-3 rounded-xl border font-semibold text-sm transition-all duration-200
//             bg-(--accent-cyan)/20 border-(--accent-cyan) text-(--accent-cyan) hover:bg-(--accent-cyan)/30"
//         >
//           Da, uradi test
//         </button>
//         <button
//           onClick={onNo}
//           className="flex-1 py-3 rounded-xl border font-semibold text-sm transition-all duration-200
//             bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
//         >
//           Preskoči
//         </button>
//       </div>
//     </div>
//   );
// }

// ─── main component ───────────────────────────────────────────────────────────

export default function SRBStepFour() {
  const {
    regime,
    model,
    estimateEarn,
    activityCode,
    municipality,
    haveMonthlyAmount,
    monthlyAmount,
    payPersonalSalary,
    trackingBusinessExpenses,
    takeSalary,
    distributeDividends,
    onlySalary,
    monthlyGrossSalary,
    trackNetPay,
    sideWorkRegime,
    calcSideActivityTax,
  } = useWizardStore();
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "1");
  const router = useRouter();

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (regime === "freelancer") {
      if (model !== null && estimateEarn !== null) {
        router.push("/sr-Latn/onboarding?step=5");
      }
    } else if (regime === "pausal") {
      if (
        activityCode !== null &&
        municipality !== null &&
        haveMonthlyAmount !== null
      ) {
        router.push("/sr-Latn/onboarding?step=5");
      }
    } else if (regime === "knjigas") {
      if (payPersonalSalary !== null && trackingBusinessExpenses !== null) {
        router.push("/sr-Latn/onboarding?step=5");
      }
    } else if (regime === "d.o.o.") {
      if (takeSalary !== null && distributeDividends !== null) {
        router.push("/sr-Latn/onboarding?step=5");
      }
    } else if (regime === "employee") {
      if (
        onlySalary !== null &&
        monthlyGrossSalary !== null &&
        trackNetPay !== null
      ) {
        router.push("/sr-Latn/onboarding?step=5");
      }
    } else if (regime === "hybrid") {
      if (model !== null && sideWorkRegime !== null) {
        router.push("/sr-Latn/onboarding?step=5");
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center text-primary gap-6 justify-between">
      {/* Header */}
      <div>
        {regime === "freelancer" ? (
          <Freelancer />
        ) : regime === "pausal" ? (
          <Pausal />
        ) : regime === "knjigas" ? (
          <Knjigas />
        ) : regime === "d.o.o." ? (
          <Doo />
        ) : regime === "employee" ? (
          <Employee />
        ) : regime === "hybrid" ? (
          <Hybrid />
        ) : null}
      </div>

      <WizardNavigationButtons
        handleProceed={handleProceed}
        currentStep={currentStep}
      />
    </div>
  );
}
