"use client";

import { MouseEvent, useState } from "react";
import { useWizardStore } from "@/lib/store/useWizardStore";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowRightIcon } from "lucide-react";

import { updateStepTwo } from "@/actions/taxProfile/updateStepTwo";
import { suggestModel } from "@/lib/suggestModel";
import { useDebounce } from "@/hooks/useDebounce";

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
  const router = useRouter();

  const [grossAnnualIncome, setGrossAnnualIncome] = useState<number>(0);
  const [isEmployed, setIsEmployed] = useState<boolean>(false);
  const [displayValue, setDisplayValue] = useState<string>("");

  const formatNumber = (value: string): string => {
    // Strip everything except digits
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    // Format using Serbian locale — uses . as thousands separator
    return Number(digits).toLocaleString("sr-RS");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);

    setDisplayValue(formatted);

    const raw = Number(e.target.value.replace(/\D/g, ""));
    setGrossAnnualIncome(raw);
  };

  // const debouncedGrossAnnualIncome = useDebounce(grossAnnualIncome, 500);

  // ---------------- ACTION ----------------

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (underForty !== null && healthInsurance !== null && employed !== null) {
      router.push("/sr-Latn/onboarding?step=3");
    }

    // let res;

    // if (regime === "frilenser") {
    //   setModel(selected.value);
    //   res = await updateStepTwo({
    //     model: selected.value,
    //     healthInsuredElsewhere: false,
    //   });
    // } else if (regime === "pausal") {
    //   res = await updateStepTwo({
    //     pausalActivityCode: selected.value,
    //   });
    // } else if (regime === "knjigas") {
    //   res = await updateStepTwo({
    //     businessModel: selected.value,
    //   });
    // }

    // if (res?.success) {
    //   router.push("/sr-Latn/onboarding?step=3");
    // } else {
    //   toast.error(res?.error || "Greška");
    // }
  };

  // ---------------- LABELS ----------------

  // const heading =
  //   regime === "frilenser"
  //     ? "Izaberite model oporezivanja"
  //     : regime === "pausal"
  //       ? "Čime se bavite?"
  //       : "Kako poslujete?";

  // const subheading =
  //   regime === "pausal" ? "Izaberite delatnost" : "Izaberite opciju";

  // ---------------- UI ----------------

  return (
    <div className="w-full h-full flex flex-col justify-between items-center primary-slate p-4 gap-4">
      {/* HEADER */}
      <div className="flex flex-col gap-2 items-center text-primary text-lg font-semibold">
        <h1 className="text-2xl font-bold text-primary">
          {tOnboarding("underFortyTitle")}
        </h1>
        <div className="flex items-center gap-2">
          <button
            className={`py-2 px-4 border ${underForty ? "bg-cyan-200/35" : ""}`}
            onClick={() => setUnderForty(true)}
          >
            Yes
          </button>
          <button
            className={`py-2 px-4 border ${underForty !== null && !underForty ? "bg-cyan-200/35" : ""}`}
            onClick={() => setUnderForty(false)}
          >
            No
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
            Yes
          </button>
          <button
            className={`py-2 px-4 border ${healthInsurance !== null && !healthInsurance ? "bg-cyan-200/35" : ""}`}
            onClick={() => setHealthInsurance(false)}
          >
            No
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
            Yes
          </button>
          <button
            className={`py-2 px-4 border ${employed !== null && !employed ? "bg-cyan-200/35" : ""}`}
            onClick={() => setEmployed(false)}
          >
            No
          </button>
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
