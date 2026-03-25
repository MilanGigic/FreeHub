"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "../../ui/accordion";

import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { useRouter } from "next/navigation";
import { Field, FieldContent, FieldLabel } from "../../ui/field";
import { US_STATES } from "@/lib/usaStates";
import { MouseEvent, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "react-toastify";
import { updateStepTwo } from "@/actions/taxProfile/updateStepTwo";
import { useTranslations } from "next-intl";

const filingStatusKeys = {
  Single: "filingSingle",
  Married: "filingMarried",
  Widowed: "filingWidowed",
  Separated: "filingSeparated",
  Divorced: "filingDivorced",
} as const;

const filingStatusValues = Object.keys(filingStatusKeys) as Array<
  keyof typeof filingStatusKeys
>;

export default function StepTwo() {
  const router = useRouter();
  const t = useTranslations("wizard");
  const [query, setQuery] = useState("");

  const [filingStatus, setFilingStatus] = useState(filingStatusValues[0]);
  const [stateResidence, setStateResidence] = useState(US_STATES[0].name);

  const debouncedQuery = useDebounce(query, 500);
  const filteredStates = US_STATES.filter((state) =>
    state.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await updateStepTwo(filingStatus, stateResidence);
    if (res.success) {
      toast.success(t("filingStatusUpdated"));
      router.push("/dashboard?wizard=true&step=3");
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
      <div className="flex gap-4 max-w-3xl h-[70vh] w-full mx-auto">
        <div className="flex flex-col gap-2 flex-1">
          <Accordion type="single" collapsible defaultValue="filingStatus">
            <AccordionItem value="filingStatus">
              <AccordionTrigger className="text-primary text-lg font-semibold">
                {t("selectFilingStatus")}
              </AccordionTrigger>
              <AccordionContent className="">
                <RadioGroup
                  defaultValue={filingStatusValues[0]}
                  className="flex flex-col gap-2"
                >
                  {filingStatusValues.map((status) => (
                    <FieldLabel
                      key={status}
                      htmlFor={status}
                      onClick={() => setFilingStatus(status)}
                    >
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldLabel className="text-primary text-lg font-semibold">
                            {t(filingStatusKeys[status])}
                          </FieldLabel>
                        </FieldContent>
                      </Field>
                      <RadioGroupItem value={status} id={status} />
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="stateResidence">
              <AccordionTrigger className="text-primary text-lg font-semibold">
                {t("chooseState")}
              </AccordionTrigger>
              <AccordionContent className="max-h-[40vh] overflow-y-auto">
                <div className="w-full px-2 sticky top-0 z-10 mb-4">
                  <input
                    type="text"
                    placeholder={t("searchState")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full outline outline-(--accent-green) rounded-lg p-2 focus:outline focus:outline-(--accent-cyan) text-primary mt-2 background-elevated"
                  />
                </div>
                <RadioGroup
                  defaultValue={filteredStates[0].name}
                  className="flex flex-col gap-2"
                >
                  {filteredStates.map((state) => (
                    <FieldLabel
                      key={state.name}
                      htmlFor={state.name}
                      onClick={() => setStateResidence(state.name)}
                    >
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldLabel className="text-primary text-lg font-semibold">
                            {state.name}
                          </FieldLabel>
                        </FieldContent>
                      </Field>
                      <RadioGroupItem value={state.name} id={state.name} />
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <h1 className="text-primary text-2xl font-bold text-center flex flex-col border-b-2 background-border pb-2">
            {t("filingStatus")}{" "}
            <span className="primary-cyan">
              {t(filingStatusKeys[filingStatus])}
            </span>
          </h1>
          <h1 className="text-primary text-2xl font-bold text-center flex flex-col">
            {t("stateOfResidence")}{" "}
            <span className="primary-cyan">{stateResidence}</span>
          </h1>
        </div>
      </div>
      <div className="flex flex-col gap-2 max-w-md w-full mx-auto">
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
        <button
          onClick={() => router.replace("/dashboard")}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center"
        >
          {t("skip")}
        </button>
      </div>
    </div>
  );
}
