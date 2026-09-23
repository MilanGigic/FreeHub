// app/onboarding/WizardContainer.tsx
"use client";
import { useSearchParams } from "next/navigation";
import SerbianTaxWizard from "./SRB/SerbianTaxWizard";
// import USATaxWizard from "./USA/USATaxWizard";

export default function WizardContainer() {
  const searchParams = useSearchParams();
  const locale = searchParams.get("locale") || "sr";

  const isSerbian = locale === "sr";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {isSerbian ? (
          <SerbianTaxWizard />
        ) : // <USATaxWizard />
        null}
      </div>
    </div>
  );
}
