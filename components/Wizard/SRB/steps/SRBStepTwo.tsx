"use client";

import { MouseEvent, useState } from "react";
import { useWizardStore } from "@/lib/store/useWizardStore";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowRightIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "../../../ui/field";
import { updateStepTwo } from "@/actions/taxProfile/updateStepTwo";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { suggestModel } from "@/lib/suggestModel";
import { useDebounce } from "@/hooks/useDebounce";

// ---------------- CARD DATA ----------------

const frilenserCards = [
  {
    title: "Model A",
    description: "Bolji za niže i nestabilne prihode",
    value: "modelA",
  },
  {
    title: "Model B",
    description: "Bolji za više i stabilne prihode",
    value: "modelB",
  },
];

const pausalCards = [
  {
    title: "IT / Programiranje",
    description: "Razvoj softvera",
    value: "62.01",
  },
  {
    title: "Marketing / Dizajn",
    description: "Marketing i dizajn",
    value: "73.11",
  },
  { title: "Konsalting", description: "Biznis konsalting", value: "70.22" },
  { title: "Trgovina", description: "Online prodaja", value: "47.91" },
  { title: "Usluge", description: "Frizer, servisi", value: "96.02" },
  { title: "Ostalo", description: "Ako niste sigurni", value: "74.90" },
];

const knjigasCards = [
  { title: "Usluge", description: "IT, freelancing", value: "services" },
  { title: "Prodaja robe", description: "E-commerce", value: "goods" },
  { title: "Mešovito", description: "Kombinovano", value: "mixed" },
];

// ---------------- COMPONENT ----------------

export default function SRBStepTwo() {
  const { regime, setModel } = useWizardStore();
  const t = useTranslations("wizard");
  const router = useRouter();

  const [grossAnnualIncome, setGrossAnnualIncome] = useState<number>(0);
  const [isEmployed, setIsEmployed] = useState<boolean>(false);

  const cards =
    regime === "frilenser"
      ? frilenserCards
      : regime === "pausal"
        ? pausalCards
        : knjigasCards;

  const [selected, setSelected] = useState(cards[0]);

  const debouncedGrossAnnualIncome = useDebounce(grossAnnualIncome, 500);

  // ---------------- ACTION ----------------

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let res;

    if (regime === "frilenser") {
      setModel(selected.value);
      res = await updateStepTwo({
        model: selected.value,
        healthInsuredElsewhere: false,
      });
    } else if (regime === "pausal") {
      res = await updateStepTwo({
        pausalActivityCode: selected.value,
      });
    } else if (regime === "knjigas") {
      res = await updateStepTwo({
        businessModel: selected.value,
      });
    }

    if (res?.success) {
      router.push("/sr-Latn/onboarding?step=3");
    } else {
      toast.error(res?.error || "Greška");
    }
  };

  // ---------------- LABELS ----------------

  const heading =
    regime === "frilenser"
      ? "Izaberite model oporezivanja"
      : regime === "pausal"
        ? "Čime se bavite?"
        : "Kako poslujete?";

  const subheading =
    regime === "pausal" ? "Izaberite delatnost" : "Izaberite opciju";

  // ---------------- UI ----------------

  return (
    <div className="w-full h-full flex flex-col justify-between items-center primary-slate p-4 gap-4">
      {/* HEADER */}
      <div className="flex flex-col gap-2 items-center text-primary text-lg font-semibold">
        <h1 className="text-2xl font-bold text-primary">{heading}</h1>
        <p className="text-sm primary-slate">{subheading}</p>
      </div>

      {/* OPTIONS */}
      <div className="flex flex-col gap-2 w-full max-w-md">
        <RadioGroup
          defaultValue={cards[0].value}
          className="flex flex-col gap-2"
        >
          {cards.map((card) => (
            <FieldLabel
              key={card.value}
              htmlFor={card.value}
              onClick={() => setSelected(card)}
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

        {regime === "frilenser" && (
          <div className="w-full h-full flex flex-col gap-2">
            <Accordion
              type="single"
              collapsible
              defaultValue="helpNeeded"
              className="w-full"
            >
              <AccordionItem value="helpNeeded" className="w-full">
                <AccordionTrigger className="text-primary text-lg font-semibold w-full">
                  Niste Sigurni?
                </AccordionTrigger>
                <AccordionContent className="animate-fade-down animate-duration-500 animate-ease-in-out w-full">
                  <FieldLabel htmlFor="helpNeeded" className="w-full">
                    <Field className="w-full items-center justify-center">
                      <FieldContent className="w-full flex flex-col gap-2 items-center justify-center">
                        <FieldLabel className="text-primary text-lg font-semibold">
                          Da li ste zaposleni?
                        </FieldLabel>
                        <div className="flex gap-2 items-center">
                          <button
                            className={`px-6 py-2 border uppercase  font-semibold text-lg background-border rounded-lg
                              ${isEmployed ? "bg-(--accent-cyan)/40 border-(--accent-cyan) text-primary" : "bg-transparent text-primary"}
                              `}
                            onClick={() => setIsEmployed(true)}
                          >
                            Da
                          </button>
                          <button
                            className={`px-6 py-2 border uppercase  font-semibold text-lg background-border rounded-lg
                              ${!isEmployed ? "bg-(--accent-red)/40 border-(--accent-red) text-primary" : "bg-transparent text-primary"}
                              `}
                            onClick={() => setIsEmployed(false)}
                          >
                            Ne
                          </button>
                        </div>
                      </FieldContent>
                    </Field>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel className="text-primary text-lg font-semibold">
                          Unesite iznos iz poslednjeg kvartala
                        </FieldLabel>

                        {/* WORK ON THIS, IT SHOULD BE LOGIC FOR IF THE USER IS UNSURE, THEY TYPE IN THE AMOUNT OF THEIR QUARTERLY INCOME AND THE APP CALCULATES WHAT WOULD THE BEST OPTION BE */}

                        <Input
                          type="string"
                          placeholder="Iznos"
                          className="w-full text-center text-lg bg-transparent border background-border rounded p-2 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
                          onChange={(e) =>
                            setGrossAnnualIncome(Number(e.target.value))
                          }
                        />
                      </FieldContent>
                    </Field>
                    <Field orientation="horizontal">
                      <FieldContent className="w-full flex flex-col gap-2 items-center justify-center">
                        <FieldLabel className="primary-slate text-lg font-semibold">
                          Mi preporučujemo:
                        </FieldLabel>
                        {debouncedGrossAnnualIncome ? (
                          <FieldDescription className="text-primary text-xl font-semibold">
                            {suggestModel(
                              debouncedGrossAnnualIncome,
                              isEmployed,
                            ).recommended === "A"
                              ? "Model A"
                              : "Model B"}
                          </FieldDescription>
                        ) : (
                          <FieldDescription>
                            Unesite iznos iz poslednjeg kvartala
                          </FieldDescription>
                        )}
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
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
