"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "../ui/accordion";

import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { useRouter } from "next/navigation";
import { Field, FieldContent, FieldLabel } from "../ui/field";
import { US_STATES } from "@/lib/usaStates";
import { MouseEvent, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "react-toastify";
import { updateStepTwo } from "@/actions/taxProfile/updateStepTwo";

const filingStatuses = [
  "Single",
  "Married",
  "Widowed",
  "Separated",
  "Divorced",
];

export default function StepTwo() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const [filingStatus, setFilingStatus] = useState(filingStatuses[0]);
  const [stateResidence, setStateResidence] = useState(US_STATES[0].name);

  const debouncedQuery = useDebounce(query, 500);
  const filteredStates = US_STATES.filter((state) =>
    state.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await updateStepTwo(filingStatus, stateResidence);
    if (res.success) {
      toast.success("Filing status and state residence updated successfully");
      router.push("/dashboard?wizard=true&step=3");
    } else {
      toast.error(res.error);
    }
  };
  return (
    <div className="w-full h-full flex flex-col justify-between items-center primary-slate p-4">
      <div className="flex flex-col gap-2 items-center text-primary text-lg font-semibold">
        <h1 className="text-2xl font-bold text-primary">Welcome to Efficio</h1>
        <p className="text-sm primary-slate">
          Let&apos;s get you set up with your account.
        </p>
      </div>
      <div className="flex gap-4 max-w-3xl h-[70vh] w-full mx-auto">
        <div className="flex flex-col gap-2 flex-1">
          <Accordion type="single" collapsible defaultValue="filingStatus">
            <AccordionItem value="filingStatus">
              <AccordionTrigger className="text-primary text-lg font-semibold">
                Select your filing status
              </AccordionTrigger>
              <AccordionContent className="">
                <RadioGroup
                  defaultValue={filingStatuses[0]}
                  className="flex flex-col gap-2"
                >
                  {filingStatuses.map((status) => (
                    <FieldLabel
                      key={status}
                      htmlFor={status}
                      onClick={() => setFilingStatus(status)}
                    >
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldLabel className="text-primary text-lg font-semibold">
                            {status}
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
                Choose your state of residence
              </AccordionTrigger>
              <AccordionContent className="max-h-[40vh] overflow-y-auto">
                <div className="w-full px-2 sticky top-0 z-10 mb-4">
                  <input
                    type="text"
                    placeholder="Search for a state"
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
            Filing Status: <span className="primary-cyan">{filingStatus}</span>
          </h1>
          <h1 className="text-primary text-2xl font-bold text-center flex flex-col">
            State of Residence:{" "}
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
            <ArrowLeftIcon size={20} /> Back
          </button>
          <button
            onClick={(e) => handleProceed(e)}
            className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2"
          >
            Proceed <ArrowRightIcon size={20} />
          </button>
        </div>
        <button
          onClick={() => router.replace("/dashboard")}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
