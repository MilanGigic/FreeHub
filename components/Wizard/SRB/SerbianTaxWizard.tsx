"use client";

import Wizard from "../Wizard";
import SRBStepOne from "./steps/SRBStepOne";
import SRBStepTwo from "./steps/SRBStepTwo";
import SRBStepThree from "./steps/SRBStepThree";
import { useWizardStore } from "@/lib/store/useWizardStore";
import SRBStepFour from "./steps/4/SRBStepFour";

export default function SerbianTaxWizard() {
  const regime = useWizardStore((s) => s.regime);

  const steps = [
    <SRBStepOne key="1" />,
    <SRBStepTwo key="2" />,
    <SRBStepThree key="3" />,
    <SRBStepFour key="4" />,
  ];

  const totalSteps =
    regime === "frilenser" ? 4 : regime === "pausal" ? 5 : regime ? 4 : 3;

  return (
    <div className="h-full w-full">
      <Wizard steps={steps} totalSteps={totalSteps} />
    </div>
  );
}
