"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { MouseEvent, useState } from "react";
import { updateStepThree } from "@/actions/taxProfile/updateStepThree";
import { toast } from "react-toastify";

export default function StepThree() {
  const router = useRouter();
  const [homeOfficeSqft, setHomeOfficeSqft] = useState<number>(0);
  const [homeOfficeSimplified, setHomeOfficeSimplified] =
    useState<boolean>(false);
  const [mileageTracking, setMileageTracking] = useState<boolean>(false);
  const [healthInsuranceDeduction, setHealthInsuranceDeduction] =
    useState<boolean>(false);

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await updateStepThree(
      homeOfficeSqft,
      homeOfficeSimplified,
      mileageTracking,
      healthInsuranceDeduction,
    );
    if (res.success) {
      router.push("/dashboard?wizard=true&step=4");
    } else {
      console.log("Error updating step three:", res.error);
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

      <div className="w-full max-w-3xl mx-auto">
        <Accordion
          type="single"
          collapsible
          defaultValue="homeOffice"
          className="w-full"
        >
          <AccordionItem value="homeOffice">
            <AccordionTrigger className="text-primary text-lg font-semibold">
              Do you use a dedicated home office for business?
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={homeOfficeSimplified ? "true" : "false"}>
                <FieldLabel>
                  <Field orientation="horizontal">
                    <Accordion
                      type="single"
                      collapsible
                      defaultValue="homeOfficeTrue"
                    >
                      <AccordionItem value="homeOfficeTrue">
                        <AccordionTrigger className="text-primary text-lg font-semibold">
                          I use a dedicated home office for business
                        </AccordionTrigger>
                        <AccordionContent className="px-2 flex flex-col gap-2">
                          <input
                            type="number"
                            min={1}
                            max={300}
                            value={homeOfficeSqft}
                            onChange={(e) =>
                              setHomeOfficeSqft(Number(e.target.value) || 0)
                            }
                            className="w-full outline outline-(--accent-green) rounded-lg p-2 focus:outline focus:outline-(--accent-cyan) text-primary mt-2"
                          />
                          <span>
                            Enter your home office square footage (1-300)
                          </span>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <RadioGroupItem
                      value="true"
                      id="homeOfficeTrue"
                      onClick={() => setHomeOfficeSimplified(true)}
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel className="text-primary text-lg font-semibold">
                        I don&apos;t use a dedicated home office for business
                      </FieldLabel>
                    </FieldContent>
                    <RadioGroupItem
                      value="false"
                      id="homeOfficeFalse"
                      onClick={() => setHomeOfficeSimplified(false)}
                    />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="businessMileage">
            <AccordionTrigger className="text-primary text-lg font-semibold">
              Do you track mileage for business use?
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={mileageTracking ? "true" : "false"}>
                <FieldLabel>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel className="text-primary text-lg font-semibold">
                        I track mileage for business use
                      </FieldLabel>
                      <FieldDescription>
                        2026 IRS rate = 72.5¢ per mile (auto-applied in your
                        dashboard)
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      value="true"
                      id="businessMileageTrue"
                      onClick={() => setMileageTracking(true)}
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel className="text-primary text-lg font-semibold">
                        I don&apos;t track mileage for business use
                      </FieldLabel>
                    </FieldContent>
                    <RadioGroupItem
                      value="false"
                      id="businessMileageFalse"
                      onClick={() => setMileageTracking(false)}
                    />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="healthInsurance">
            <AccordionTrigger className="text-primary text-lg font-semibold">
              Do you pay for your own health insurance?
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={healthInsuranceDeduction ? "true" : "false"}>
                <FieldLabel>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel className="text-primary text-lg font-semibold">
                        I pay for my own health insurance
                      </FieldLabel>
                    </FieldContent>
                    <RadioGroupItem
                      value="true"
                      id="healthInsuranceTrue"
                      onClick={() => setHealthInsuranceDeduction(true)}
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel className="text-primary text-lg font-semibold">
                        I don&apos;t pay for my own health insurance
                      </FieldLabel>
                    </FieldContent>
                    <RadioGroupItem
                      value="false"
                      id="healthInsuranceFalse"
                      onClick={() => setHealthInsuranceDeduction(false)}
                    />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
