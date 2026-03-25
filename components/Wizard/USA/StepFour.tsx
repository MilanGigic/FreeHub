"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Field, FieldLabel, FieldContent } from "../../ui/field";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import { toast } from "react-toastify";
import { updateStepFour } from "@/actions/taxProfile/updateStepFour";
import { useTranslations } from "next-intl";

export default function StepFour() {
  const router = useRouter();
  const t = useTranslations("wizard");
  const [retirementContribution, setRetirementContribution] =
    useState<boolean>(false);

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await updateStepFour(retirementContribution);
    if (res.success) {
      router.push("/dashboard?wizard=true&step=5");
    } else {
      toast.error(res.error);
    }
  };
  return (
    <div className="w-full h-full flex flex-col justify-between items-center primary-slate p-4">
      <div className="flex flex-col gap-2 items-center text-primary text-lg font-semibold">
        <h1 className="text-2xl font-bold text-primary">{t("welcomeTitle")}</h1>
        <p className="text-sm primary-slate">{t("welcomeSubtitle")}</p>
      </div>

      <div>
        <RadioGroup>
          <FieldLabel>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel className="text-primary text-lg font-semibold">
                  {t("retirementYes")}
                </FieldLabel>
              </FieldContent>
              <RadioGroupItem
                value="true"
                id="retirement-toggle"
                onClick={() => setRetirementContribution(true)}
              />
            </Field>
          </FieldLabel>
          <FieldLabel>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel className="text-primary text-lg font-semibold">
                  {t("retirementNo")}
                </FieldLabel>
              </FieldContent>
              <RadioGroupItem
                value="false"
                id="retirement-toggle"
                onClick={() => setRetirementContribution(false)}
              />
            </Field>
          </FieldLabel>
        </RadioGroup>
        <p className="text-sm text-zinc-500">{t("retirementToggle")}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => router.push("/dashboard?wizard=true&step=1")}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon size={20} /> {t("back")}
        </button>
        <button
          onClick={(e) => handleProceed(e)}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2"
        >
          {t("proceed")} <ArrowRightIcon size={20} />
        </button>
      </div>
    </div>
  );
}
