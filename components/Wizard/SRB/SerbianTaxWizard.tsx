"use client";

import Wizard from "../Wizard";
import SRBStepOne from "./steps/SRBStepOne";
import SRBStepTwo from "./steps/SRBStepTwo";
import SRBStepThree from "./steps/SRBStepThree";
import SRBStepFour from "./steps/4/SRBStepFour";
import SRBStepFive from "./steps/SRBStepFive";
import SRBStepSix from "./steps/SRBStepSix";

export default function SerbianTaxWizard() {
  const steps = [
    <SRBStepOne key="1" />,
    <SRBStepTwo key="2" />,
    <SRBStepThree key="3" />,
    <SRBStepFour key="4" />,
    <SRBStepFive key="5" />,
    <SRBStepSix key="6" />,
  ];

  const totalSteps = 7;

  return (
    <div className="h-full w-full">
      <Wizard steps={steps} totalSteps={totalSteps} />
    </div>
  );
}
