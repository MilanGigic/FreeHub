"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

export default function WizardNavigationButtons({
  handleProceed,
  currentStep,
}: {
  handleProceed: (e: MouseEvent<HTMLButtonElement>) => void;
  currentStep: number;
}) {
  const router = useRouter();
  const t = useTranslations("wizard");
  return (
    <div className="flex flex-col gap-2 max-w-md w-full mx-auto mb-12">
      <button
        onClick={handleProceed}
        className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
      >
        {t("proceed")} <ArrowRightIcon size={20} />
      </button>

      <button
        onClick={() => router.replace("/sr-Latn/onboarding")}
        className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        {t("skip")}
      </button>
      <button
        onClick={() =>
          router.push(`/sr-Latn/onboarding?step=${currentStep - 1}`)
        }
        className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
      >
        <ArrowLeftIcon size={20} /> {t("back")}
      </button>
    </div>
  );
}
