import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useWizardStore } from "@/lib/store/useWizardStore";
import { suggestModel } from "@/lib/suggestModel";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Freelancer() {
  const { model, setModel, setEstimateEarn, employed } = useWizardStore();
  const tOnboarding = useTranslations("onboarding.freelancer");

  const [grossAnnualIncome, setGrossAnnualIncome] = useState<number>(0);
  const [displayValue, setDisplayValue] = useState<string>("");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Čistimo sve što nisu cifre da dobijemo čist broj za stanje
    const digits = inputValue.replace(/\D/g, "");
    const raw = digits ? Number(digits) : 0;

    // Formatiramo za prikaz na ekranu
    const formatted = formatNumber(inputValue);

    setDisplayValue(formatted);
    setGrossAnnualIncome(raw);
  };

  const handleEstimateEarnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const digits = inputValue.replace(/\D/g, "");
    const raw = digits ? Number(digits) : 0;

    const formatted = formatNumber(inputValue);

    setEstimateEarnDisplay(formatted);
    setEstimateEarn(raw);
  };

  const debouncedGrossAnnualIncome = useDebounce(grossAnnualIncome, 500);

  return (
    <div
      className={`flex flex-col items-center gap-4 w-full ${model !== null ? "border-b-2" : ""}`}
    >
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold uppercase">
          {tOnboarding("modelTitle")}
        </h1>
        <div className="flex items-center gap-4 p-2">
          <button
            className={`py-2 px-4 border ${model === "Model A" ? "bg-purple-200/35" : ""}`}
            onClick={() => setModel("Model A")}
          >
            Model A
          </button>
          <button
            className={`py-2 px-4 border ${model === "Model B" ? "bg-purple-200/35" : ""}`}
            onClick={() => setModel("Model B")}
          >
            Model B
          </button>
        </div>
      </div>

      <h2 className="text-lg font-semibold">{model}</h2>
      <Accordion
        type="single"
        collapsible
        defaultValue="helpNeeded"
        className="w-full"
      >
        <AccordionItem value="helpNeeded" className="w-full">
          <AccordionTrigger className="text-primary text-lg font-semibold w-full">
            {tOnboarding("notSure")}
          </AccordionTrigger>
          <AccordionContent className="animate-fade-down animate-duration-500 animate-ease-in-out w-full">
            <FieldLabel htmlFor="helpNeeded" className="w-full">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel className="text-primary text-lg font-semibold">
                    {tOnboarding("quartalRevenueTitle")}
                  </FieldLabel>

                  <Input
                    type="string"
                    inputMode="numeric"
                    placeholder="Iznos"
                    className="w-full text-center text-lg bg-transparent border background-border rounded p-2 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
                    onChange={(e) => handleChange(e)}
                    value={displayValue}
                  />
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <FieldContent className="w-full flex flex-col gap-2 items-center justify-center">
                  <FieldLabel className="primary-slate text-lg font-semibold">
                    {tOnboarding("suggest")}:
                  </FieldLabel>
                  {debouncedGrossAnnualIncome ? (
                    <FieldDescription className="text-primary text-xl font-semibold">
                      {suggestModel(debouncedGrossAnnualIncome, employed!)
                        .recommended === "A"
                        ? "Model A"
                        : "Model B"}
                    </FieldDescription>
                  ) : (
                    <FieldDescription>
                      {tOnboarding("quartalRevenueTitle")}
                    </FieldDescription>
                  )}
                </FieldContent>
              </Field>
            </FieldLabel>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex flex-col items-center w-full text-center gap-4 p-2">
        <h1 className="text-xl font-semibold uppercase">
          {tOnboarding("estimateTitle")} <br />{" "}
          <span className="text-slate-400">{tOnboarding("estimateHint")}</span>
        </h1>
        <input
          type="text"
          inputMode="numeric"
          placeholder={`${tOnboarding("estimatePlaceholder")}`}
          className="border py-2 px-4 w-full text-center"
          onChange={(e) => handleEstimateEarnChange(e)}
          value={estimateEarnDisplay}
        />
      </div>
    </div>
  );
}
