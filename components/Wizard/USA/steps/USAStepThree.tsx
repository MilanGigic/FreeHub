"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MouseEvent, useState } from "react";
import { updateStepThree } from "@/actions/taxProfile/updateStepThree";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export default function USAStepThree() {
  const router = useRouter();
  const t = useTranslations("wizard");
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
        <h1 className="text-2xl font-bold text-primary">{t("welcomeTitle")}</h1>
        <p className="text-sm primary-slate">{t("welcomeSubtitle")}</p>
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
              {t("homeOfficeQuestion")}
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
                          {t("homeOfficeYes")}
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
                          <span>{t("homeOfficeSquareFootage")}</span>
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
                        {t("homeOfficeNo")}
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
              {t("mileageQuestion")}
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={mileageTracking ? "true" : "false"}>
                <FieldLabel>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel className="text-primary text-lg font-semibold">
                        {t("mileageYes")}
                      </FieldLabel>
                      <FieldDescription>{t("mileageIRSRate")}</FieldDescription>
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
                        {t("mileageNo")}
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
              {t("healthInsuranceQuestion")}
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={healthInsuranceDeduction ? "true" : "false"}>
                <FieldLabel>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel className="text-primary text-lg font-semibold">
                        {t("healthInsuranceYes")}
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
                        {t("healthInsuranceNo")}
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
