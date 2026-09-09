"use client";

import { useWizardStore } from "@/lib/store/useWizardStore";
import { MouseEvent, useState } from "react";
import WizardNavigationButtons from "../../WizardNavigationButtons";
import { useRouter, useSearchParams } from "next/navigation";
import PausalCard3 from "../PausalCard3";
import KnjigasCard3 from "../KnjigasCard3";
import FrilenserCard3 from "../FrilenserCard3";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "../../../ui/field";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { updateStepThree } from "@/actions/taxProfile/updateStepThree";
import { useTranslations } from "next-intl";
import { Regime } from "@/types/types";

// const frilenserCards = [
//   {
//     title: "Model A",
//     description: "Bolji za niže i nestabilne prihode",
//     value: "modelA",
//   },
//   {
//     title: "Model B",
//     description: "Bolji za više i stabilne prihode",
//     value: "modelB",
//   },
// ];

// const pausalCards = [
//   {
//     title: "IT / Programiranje",
//     description: "Razvoj softvera",
//     value: "62.01",
//   },
//   {
//     title: "Marketing / Dizajn",
//     description: "Marketing i dizajn",
//     value: "73.11",
//   },
//   { title: "Konsalting", description: "Biznis konsalting", value: "70.22" },
//   { title: "Trgovina", description: "Online prodaja", value: "47.91" },
//   { title: "Usluge", description: "Frizer, servisi", value: "96.02" },
//   { title: "Ostalo", description: "Ako niste sigurni", value: "74.90" },
// ];

// const knjigasCards = [
//   { title: "Usluge", description: "IT, freelancing", value: "services" },
//   { title: "Prodaja robe", description: "E-commerce", value: "goods" },
//   { title: "Mešovito", description: "Kombinovano", value: "mixed" },
// ];

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
      <div className="flex flex-col gap-2 w-full max-w-md">
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

// TODO: Refactor this component
// >>>>> Add updateStepThree.ts action
