"use client";

import { MouseEvent } from "react";
import { useWizardStore } from "@/lib/store/useWizardStore";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

// ---------------- CARD DATA ----------------

// ---------------- COMPONENT ----------------

export default function SRBStepTwo() {
  const {
    underForty,
    setUnderForty,
    healthInsurance,
    setHealthInsurance,
    employed,
    setEmployed,
  } = useWizardStore();
  const t = useTranslations("wizard");
  const tOnboarding = useTranslations("onboarding.stepTwo");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (underForty !== null && healthInsurance !== null && employed !== null) {
      router.push("/sr-Latn/onboarding?step=3");
    }
  };
  return (
    <div className="w-full h-full flex flex-col justify-between items-center primary-slate p-4 gap-4">
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="flex flex-col gap-2 items-center text-primary text-lg font-semibold">
          <h1 className="text-2xl font-bold text-primary">
            {tOnboarding("underFortyTitle")}
          </h1>
          <div className="flex items-center gap-2">
            <button
              className={`py-2 px-4 border ${underForty ? "bg-cyan-200/35" : ""}`}
              onClick={() => setUnderForty(true)}
            >
              {tCommon("yes")}
            </button>
            <button
              className={`py-2 px-4 border ${underForty !== null && !underForty ? "bg-cyan-200/35" : ""}`}
              onClick={() => setUnderForty(false)}
            >
              {tCommon("no")}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center text-primary text-lg font-semibold">
          <h1 className="text-2xl font-bold text-primary">
            {tOnboarding("healthInsuranceTitle")}
          </h1>
          <div className="flex items-center gap-2">
            <button
              className={`py-2 px-4 border ${healthInsurance ? "bg-cyan-200/35" : ""}`}
              onClick={() => setHealthInsurance(true)}
            >
              {tCommon("yes")}
            </button>
            <button
              className={`py-2 px-4 border ${healthInsurance !== null && !healthInsurance ? "bg-cyan-200/35" : ""}`}
              onClick={() => setHealthInsurance(false)}
            >
              {tCommon("no")}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center text-primary text-lg font-semibold">
          <h1 className="text-2xl font-bold text-primary">
            {tOnboarding("employedTitle")}
          </h1>
          <div className="flex items-center gap-2">
            <button
              className={`py-2 px-4 border ${employed ? "bg-cyan-200/35" : ""}`}
              onClick={() => setEmployed(true)}
            >
              {tCommon("yes")}
            </button>
            <button
              className={`py-2 px-4 border ${employed !== null && !employed ? "bg-cyan-200/35" : ""}`}
              onClick={() => setEmployed(false)}
            >
              {tCommon("no")}
            </button>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-2 max-w-md w-full mx-auto">
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
          onClick={() => router.push("/sr-Latn/onboarding?step=1")}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          {t("back")}
        </button>
      </div>
    </div>
  );
}
