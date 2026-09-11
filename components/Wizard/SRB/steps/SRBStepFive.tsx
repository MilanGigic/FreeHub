import { useWizardStore } from "@/lib/store/useWizardStore";
import WizardNavigationButtons from "../../WizardNavigationButtons";
import { MouseEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SRBStepFive() {
  const {
    inVatSystem,
    setInVatSystem,
    expectedAnnualRevenue,
    setExpectedAnnualRevenue,
    stepFiveDone,
    setVatRegistrationDate,
  } = useWizardStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "1");

  const tOnboarding = useTranslations("onboarding.stepFive");
  const tCommon = useTranslations("common");

  const [estimateEarnDisplay, setEstimateEarnDisplay] = useState<string>("");

  const formatNumber = (value: string): string => {
    // 1. Očisti sve što nije cifra
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    // 2. Formatiramo preko Intl.NumberFormat gde eksplicitno definišemo tačku
    // Ovo garantuje da će i milioni imati tačke (1.200.000) umesto razmaka
    return new Intl.NumberFormat("de-DE").format(Number(digits));
    // Napomena: Nemački (de-DE) koristi identičan format kao srpski (tačka za hiljade, zapet zapetu),
    // ali je konzistentniji na svim pretraživačima za milione.
  };

  const handleEstimateEarnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const digits = inputValue.replace(/\D/g, "");
    const raw = digits ? Number(digits) : 0;

    const formatted = formatNumber(inputValue);

    setEstimateEarnDisplay(formatted);
    setExpectedAnnualRevenue(raw);
  };

  const handleProceed = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (inVatSystem !== null && expectedAnnualRevenue !== null) {
      router.push("/sr-Latn/onboarding?step=6");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center text-primary gap-6 justify-between">
      <div
        className={`flex flex-col items-center justify-center h-full w-full text-center gap-4 p-2 ${stepFiveDone ? "border-b-2" : ""}`}
      >
        <div className="flex flex-col items-center w-full text-center gap-4 p-2">
          <h1 className="text-xl font-semibold uppercase">
            {tOnboarding("vatTitle")}
          </h1>
          <div className="flex items-center gap-4">
            <button
              className={`py-2 px-4 border ${inVatSystem ? "bg-cyan-200/35" : ""}`}
              onClick={() => setInVatSystem(true)}
            >
              {tCommon("yes")}
            </button>
            <button
              className={`py-2 px-4 border ${inVatSystem !== null && !inVatSystem ? "bg-cyan-200/35" : ""}`}
              onClick={() => setInVatSystem(false)}
            >
              {tCommon("no")}
            </button>
          </div>

          {inVatSystem ? (
            <div>
              <h1>{tOnboarding("vatRegistrationDate")}</h1>

              <input
                type="date"
                className="border px-4 py-2"
                onChange={(e) =>
                  setVatRegistrationDate(new Date(e.target.value))
                }
              />
            </div>
          ) : null}
        </div>
        <div className="flex flex-col items-center w-full text-center gap-4 p-2">
          <h1 className="text-xl font-semibold uppercase">
            {tOnboarding("expectedRevenueTitle")} <br />{" "}
            <span className="text-slate-400">
              {" "}
              {tOnboarding("expectedRevenueHint")}
            </span>
          </h1>
          <input
            type="string"
            inputMode="numeric"
            placeholder={`${tOnboarding("expectedRevenuePlaceholder")}`}
            className="text-center px-4 py-2 border w-full"
            value={estimateEarnDisplay}
            onChange={(e) => handleEstimateEarnChange(e)}
          />
        </div>
      </div>

      <WizardNavigationButtons
        handleProceed={handleProceed}
        currentStep={currentStep}
      />
    </div>
  );
}
