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
import WizardNavigationButtons from "@/components/Wizard/WizardNavigationButtons";
import { useDebounce } from "@/hooks/useDebounce";
import { useWizardStore } from "@/lib/store/useWizardStore";
import { suggestModel } from "@/lib/suggestModel";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { MouseEvent, useState } from "react";

export default function Freelancer() {
  const { model, setModel, estimateEarn, setEstimateEarn, employed } =
    useWizardStore();
  const tOnboarding = useTranslations("onboarding.freelancer");
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "1");
  const router = useRouter();

  const [grossAnnualIncome, setGrossAnnualIncome] = useState<number>(0);
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

  const debouncedGrossAnnualIncome = useDebounce(grossAnnualIncome, 500);

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!model || !estimateEarn) return null;

    router.push("/sr-Latn/onboarding?step=4");
  };

  return (
    <div
      className={`flex flex-col items-center gap-4 w-full ${model !== null ? "border-b-2" : ""}`}
    >
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold uppercase">
          {tOnboarding("modeltitle")}
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
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldLabel className="text-primary text-lg font-semibold">
                    Unesite iznos iz poslednjeg kvartala
                  </FieldLabel>

                  <Input
                    type="string"
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
                    Mi preporučujemo:
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
                      Unesite iznos iz poslednjeg kvartala
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
          <span className="text-slate-400">
            ({tOnboarding("estimateHint")})
          </span>
        </h1>
        <input
          type="number"
          placeholder={`${tOnboarding("estimatePlaceholder")}`}
          className="border py-2 px-4 w-full text-center"
          onChange={(e) => setEstimateEarn(Number(e.target.value))}
        />
      </div>

      <WizardNavigationButtons
        handleProceed={handleProceed}
        currentStep={currentStep}
      />
    </div>
  );
}
