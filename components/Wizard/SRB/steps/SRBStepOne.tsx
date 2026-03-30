"use client";

import { MouseEvent, useState } from "react";
import { useWizardStore } from "@/lib/store/useWizardStore";
import { useTranslations } from "next-intl";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "../../../ui/field";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowRightIcon } from "lucide-react";
import { updateStepOne } from "@/actions/taxProfile/updateStepOne";

// ---------------- CARD DATA ----------------

const cards = [
  {
    title: "Frilenser",
    description: "(radim bez registrovane firme)",
    value: "frilenser",
  },
  {
    title: "Paušalac",
    description: "(fiksni mesečni porez)",
    value: "pausal",
  },
  {
    title: "Knjigaš",
    description: "(stvarni obračun sa knjigovodstvom)",
    value: "knjigas",
  },
];

// ---------------- COMPONENT ----------------

export default function SRBStepOne() {
  const t = useTranslations("wizard");
  const { setRegime } = useWizardStore();
  const router = useRouter();

  const [selected, setSelected] = useState(cards[0]);

  // ---------------- ACTION ----------------

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res = await updateStepOne(selected.value);

    if (res.success) {
      setRegime(selected.value);
      router.push("/sr-Latn/onboarding?step=2");
    } else {
      toast.error(res.error ?? "Failed to save step 1");
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
          {t("chooseBusinessStructure")}
        </h1>
        <RadioGroup
          defaultValue={cards[0].value}
          className="flex flex-col gap-2"
        >
          {cards.map((card) => (
            <FieldLabel
              key={card.value}
              htmlFor={card.value}
              onClick={() => {
                setSelected(card);
              }}
            >
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel className="text-primary text-lg font-semibold">
                    {card.title}
                  </FieldLabel>
                  <FieldDescription>{card.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={card.value} id={card.value} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
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
