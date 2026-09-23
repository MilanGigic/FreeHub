"use client";

import { useWizardStore } from "@/lib/store/useWizardStore";
import { MouseEvent, useState } from "react";
import WizardNavigationButtons from "../../WizardNavigationButtons";
import { useRouter, useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "../../../ui/field";
import { useTranslations } from "next-intl";
import { Regime } from "@/types/types";

export default function SRBStepThree() {
  const { setRegime } = useWizardStore();
  const tOnboarding = useTranslations("onboarding.stepThree");
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "1");
  const router = useRouter();

  const [selected, setSelected] = useState<string | null>(null);

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selected) return null;

    setRegime(selected as Regime);
    router.push("/sr-Latn/onboarding?step=4");
  };

  const cards = [
    {
      regime: "freelancer",
      description: "freelancer",
    },
    {
      regime: "pausal",
      description: "pausal",
    },
    {
      regime: "knjigas",
      description: "knjigas",
    },
    {
      regime: "doo",
      description: "doo",
    },
    {
      regime: "employment",
      description: "employment",
    },
    {
      regime: "hybrid",
      description: "hybrid",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col text-primary justify-between">
      <h1 className="text-primary text-2xl font-semibold w-full text-center uppercase tracking-wider">
        {tOnboarding("title")}
      </h1>
      {/* OPTIONS */}
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
        <RadioGroup
          defaultValue={cards[0].regime}
          className="flex flex-col gap-2"
        >
          {cards.map((card, index) => (
            <FieldLabel
              key={index}
              htmlFor={card.regime}
              onClick={() => setSelected(card.regime)}
            >
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel className="text-primary text-lg font-semibold">
                    {card.regime}
                  </FieldLabel>
                  <FieldDescription>{card.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={card.regime} id={card.regime} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </div>

      <WizardNavigationButtons
        handleProceed={handleProceed}
        currentStep={currentStep}
      />
    </div>
  );
}
