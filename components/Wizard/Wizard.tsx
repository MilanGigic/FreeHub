"use client";

import { useWizardStore } from "@/lib/store/useWizardStore";
import { Dot } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FaCheck } from "react-icons/fa6";

type WizardProps = {
  steps: React.ReactNode[];
  totalSteps?: number;
};

export default function Wizard({ steps, totalSteps }: WizardProps) {
  const searchParams = useSearchParams();

  const t = useTranslations("wizard");
  const {
    country,
    taxResident,
    underForty,
    healthInsurance,
    employed,
    regime,
    model,
    estimateEarn,
    activityCode,
    municipality,
    haveMonthlyAmount,
    monthlyAmount,
    expectedYearRevenue,
    payPersonalSalary,
    trackingBusinessExpenses,
    personalSalary,
    inVatSystem,
    expectedAnnualRevenue,
    mainClients,
    otherSignificantIncome,
  } = useWizardStore();

  // URL is 1-indexed (?step=1, ?step=2, ?step=3)
  // Array is 0-indexed — subtract 1 when indexing
  const currentStep = parseInt(searchParams.get("step") || "1");
  const currentIndex = currentStep - 1;
  const progressSteps = Math.max(totalSteps ?? steps.length, 1);

  function renderStepName(step: number) {
    switch (step + 1) {
      case 1:
        return (
          <h1 className="text-primary flex flex-col">
            Drzavljanstvo
            <span className="text-slate-400 uppercase text-xs flex">
              {country} <Dot width={16} height={16} />
              {taxResident ? "Da" : "Ne"}
            </span>
          </h1>
        );
      case 2:
        return (
          <h1 className="text-primary flex flex-col">
            Lični status
            <span className="text-slate-400 uppercase text-xs flex">
              {underForty === null ? "" : underForty ? "Ispod 40" : "Iznad 40"}{" "}
              <Dot width={16} height={16} />{" "}
              {healthInsurance === null
                ? ""
                : healthInsurance
                  ? "Osiguran"
                  : "Neosiguran"}{" "}
              <Dot width={16} height={16} />{" "}
              {employed === null ? "" : employed ? "Zaposlen" : "Nezaposlen"}
            </span>
          </h1>
        );
      case 3:
        return (
          <h1 className="text-primary flex flex-col">
            Rezim
            <span className="text-slate-400 uppercase text-xs flex">
              {regime}
            </span>
          </h1>
        );
      case 4:
        return (
          <h1 className="text-primary flex flex-col">
            {regime === "freelancer"
              ? "Model"
              : regime === "pausal"
                ? "Delatnosti"
                : "Plata i troskovi"}
            {regime === "freelancer" ? (
              <span className="text-slate-400 uppercase text-xs flex">
                {model} <Dot width={16} height={16} /> {estimateEarn}
              </span>
            ) : regime === "pausal" ? (
              <span className="text-slate-400 uppercase text-xs flex">
                {activityCode} <Dot width={16} height={16} /> {municipality}{" "}
                <Dot width={16} height={16} />{" "}
                {haveMonthlyAmount === null
                  ? ""
                  : haveMonthlyAmount
                    ? "Ima"
                    : "Nema"}
                {haveMonthlyAmount ? (
                  <>
                    <Dot width={16} height={16} />
                    {monthlyAmount}
                  </>
                ) : null}
                <Dot width={16} height={16} />
                {expectedYearRevenue}
              </span>
            ) : regime === "knjigas" ? (
              <span className="text-slate-400 uppercase text-xs flex">
                {payPersonalSalary === null
                  ? ""
                  : payPersonalSalary
                    ? "Placa"
                    : "Ne Placa"}{" "}
                {payPersonalSalary ? (
                  <>
                    <Dot width={16} height={16} />
                    {personalSalary}
                  </>
                ) : null}
                <Dot width={16} height={16} />{" "}
                {trackingBusinessExpenses === null
                  ? ""
                  : trackingBusinessExpenses
                    ? "Prati Troskove"
                    : "Ne Prati Troskove"}
              </span>
            ) : null}
          </h1>
        );
      case 5:
        return (
          <h1 className="text-primary flex flex-col">
            PDV i Prihod
            <span className="text-slate-400 uppercase text-xs flex">
              {inVatSystem === null
                ? ""
                : inVatSystem
                  ? "U sistemu"
                  : "Nije u sistemu"}
              <Dot width={16} height={16} />
              {expectedAnnualRevenue}
            </span>
          </h1>
        );
      case 6:
        return (
          <h1 className="text-primary flex flex-col">
            Klijenti i Prihod
            <span className="text-slate-400 uppercase text-xs flex">
              {mainClients} <Dot width={16} height={16} />
              {otherSignificantIncome === null
                ? ""
                : otherSignificantIncome
                  ? "Da"
                  : "Ne"}
            </span>
          </h1>
        );
    }
  }

  // model |

  return (
    <div className="min-h-screen h-full w-full flex items-center justify-center">
      <div className="hidden w-24 lg:w-124 pt-16 self-stretch z-20 sm:flex sm:flex-col border-r background-border">
        <div className="flex flex-col gap-16 px-8 w-full">
          <div className="flex flex-col gap-2 text-primary text-lg font-semibold">
            <h4 className="text-sm uppercase tracking-widest text-slate-400 font-medium">
              Podešavanje naloga
            </h4>
            <h1 className="text-2xl font-bold text-primary">
              {t("welcomeTitle")}
            </h1>
            <p className="text-sm primary-slate">{t("welcomeSubtitle")}</p>
          </div>

          <div className="flex flex-col gap-8">
            {Array.from({ length: progressSteps }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`h-12 w-12 flex items-center justify-center rounded-full transition-all
                    ${
                      index + 1 === currentStep
                        ? "border-2 border-emerald-500 text-emerald-500"
                        : index < currentStep
                          ? "bg-emerald-500"
                          : "border-zinc-700 border-2 text-tertiary"
                    }`}
                >
                  {index + 1 === currentStep ? (
                    index + 1
                  ) : index < currentStep ? (
                    <FaCheck />
                  ) : (
                    index + 1
                  )}
                </div>
                {renderStepName(index)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full h-screen p-4">
        <div className="flex-1 overflow-auto min-h-0">
          {steps[currentIndex] || null}
        </div>
      </div>
    </div>
  );
}
