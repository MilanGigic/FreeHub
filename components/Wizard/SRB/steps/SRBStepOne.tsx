"use client";

import { useWizardStore } from "@/lib/store/useWizardStore";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { MouseEvent } from "react";

// ---------------- CARD DATA ----------------

// ---------------- COMPONENT ----------------

export default function SRBStepOne() {
  const t = useTranslations("wizard");
  const tOnboarding = useTranslations("onboarding.stepOne");
  const router = useRouter();

  const { country, setCountry, taxResident, setTaxResident } = useWizardStore();

  // ---------------- ACTION ----------------

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (country && taxResident !== null) {
      router.push("/sr-Latn/onboarding?step=2");
    }
  };

  // ---------------- UI ----------------

  return (
    <div className="w-full h-full flex flex-col justify-between items-center primary-slate p-4 gap-4">
      <div className="flex flex-col gap-2 items-center text-primary text-lg font-semibold">
        <h1 className="text-2xl font-bold text-primary">{t("welcomeTitle")}</h1>
        <p className="text-sm primary-slate">{t("welcomeSubtitle")}</p>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-primary text-2xl font-bold text-center">
          {tOnboarding("countryTitle")}
        </h1>
        <div className="flex flex-col items-center gap-4 border-b-2 p-2">
          <h1 className="text-xl font-semibold uppercase">Country</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCountry("SRB")}
              className={`py-2 px-4 border ${country === "SRB" ? "bg-white/35" : ""}`}
            >
              SRB
            </button>
            <button
              onClick={() => setCountry("US")}
              className={`py-2 px-4 border ${country === "US" ? "bg-white/35" : ""}`}
            >
              US
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 p-2">
        <h1 className="text-xl font-semibold uppercase">
          {tOnboarding("taxResidentTitle")}
        </h1>
        <div className="flex items-center gap-2">
          <button
            className={`py-2 px-4 border ${taxResident ? "bg-white/35" : ""}`}
            onClick={() => setTaxResident(true)}
          >
            {tOnboarding("taxResidentYes")}
          </button>
          <button
            className={`py-2 px-4 border ${taxResident !== null && !taxResident ? "bg-white/35" : ""}`}
            onClick={() => setTaxResident(false)}
          >
            {tOnboarding("taxResidentNo")}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 max-w-md w-full mx-auto">
        <button
          onClick={handleProceed}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2"
        >
          {t("proceed")} <ArrowRightIcon size={20} />
        </button>

        <button
          onClick={() => {
            router.replace("/sr-Latn/onboarding");
          }}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center"
        >
          {t("skip")}
        </button>
      </div>
    </div>
  );
}
