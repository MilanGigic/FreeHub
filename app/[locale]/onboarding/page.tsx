"use client";
import { usePathname } from "next/navigation";

import SerbianTaxWizard from "@/components/Wizard/SRB/SerbianTaxWizard";
// import USATaxWizard from "@/components/Wizard/USA/USATaxWizard";

export default function OnboardingPage() {
  const pathname = usePathname();

  const isSerbian = pathname.includes("sr-Latn");
  // const isUSA = pathname.includes("en");

  return (
    <div className="background-elevated h-full flex items-center justify-center w-full">
      {/* {isSerbian ? <SerbianTaxWizard /> : isUSA ? <USATaxWizard /> : null} */}
      <SerbianTaxWizard />
    </div>
  );
}
