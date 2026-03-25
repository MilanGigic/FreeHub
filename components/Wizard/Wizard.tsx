"use client";

import { ArrowRightIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";

export default function Wizard() {
  const router = useRouter();
  const t = useTranslations("wizard");

  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-xs w-full h-full p-4 z-50 flex items-center justify-center">
      <div className="flex flex-col w-full h-full max-w-7xl max-h-[80vh] background-elevated border background-border rounded-lg p-4">
        {!step ? (
          <div className="w-full h-full flex flex-col items-center justify-between primary-slate">
            <div className="flex flex-col gap-2 items-center text-primary text-lg font-semibold">
              <h1 className="text-2xl font-bold text-primary">
                {t("welcomeTitle")}
              </h1>
              <p className="text-sm primary-slate">
                {t("welcomeSubtitle")}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-primary text-lg font-semibold max-w-lg mx-auto">
              <p>{t("finishSetup")}</p>
              <p>{t("helpUnderstand")}</p>
              <p>{t("askQuestions")}</p>
              <p>{t("changeAnswers")}</p>
              <p>{t("skipStep")}</p>
            </div>
            <div className="flex flex-col gap-2 max-w-md w-full mx-auto">
              <button
                onClick={() => router.push("/dashboard?wizard=true&step=1")}
                className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2"
              >
                {t("proceed")} <ArrowRightIcon size={20} />
              </button>
              <button
                onClick={() => router.replace("/dashboard")}
                className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center"
              >
                {t("skip")}
              </button>
            </div>
          </div>
        ) : step === "1" ? (
          <StepOne />
        ) : step === "2" ? (
          <StepTwo />
        ) : step === "3" ? (
          <StepThree />
        ) : step === "4" ? (
          <StepFour />
        ) : step === "5" ? (
          <StepFive />
        ) : null}
      </div>
    </div>
  );
}
