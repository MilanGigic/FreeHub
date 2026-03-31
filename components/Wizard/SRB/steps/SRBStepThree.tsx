"use client";

import { useWizardStore } from "@/lib/store/useWizardStore";
import { MouseEvent, useState } from "react";
import WizardNavigationButtons from "../../WizardNavigationButtons";
import { useRouter, useSearchParams } from "next/navigation";
import PausalCard3 from "../PausalCard3";
import KnjigasCard3 from "../KnjigasCard3";
import FrilenserCard3 from "../FrilenserCard3";
import { updateStepThree } from "@/actions/taxProfile/updateStepThree";

export default function SRBStepThree() {
  const { regime } = useWizardStore();
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "1");
  const router = useRouter();
  const [activeMonths, setActiveMonths] = useState<number | null>(null);
  const [grossAnnualIncome, setGrossAnnualIncome] = useState<number>(0);
  const [isLessThan40, setIsLessThan40] = useState<boolean>(false);
  const [municipality, setMunicipality] = useState<string>("");
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [averageAnnualSalary, setAverageAnnualSalary] = useState<number>(0);
  const [personalSalary, setPersonalSalary] = useState<number>(0);
  const [isPayingPersonalSalary, setIsPayingPersonalSalary] =
    useState<boolean>(false);
  const [numberOfClients, setNumberOfClients] = useState<number>(0);

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let res;

    if (regime === "frilenser") {
      res = await updateStepThree({
        activeMonths: activeMonths ?? undefined,
        numberOfClients,
        estimatedAnnualGross: grossAnnualIncome,
        isUnder40: isLessThan40,
      });
    } else if (regime === "pausal") {
      res = await updateStepThree({
        pausalMunicipality: municipality,
        pausalEmployeeCount: employeeCount,
        estimatedAnnualGross: averageAnnualSalary,
        isUnder40: isLessThan40,
        activeMonths: activeMonths ?? undefined,
      });
    } else if (regime === "knjigas") {
      res = await updateStepThree({
        paysPersonalSalary: isPayingPersonalSalary,
        personalSalaryAmount: personalSalary,
        estimatedAnnualGross: averageAnnualSalary,
        numberOfClients,
        isUnder40: isLessThan40,
        activeMonths: activeMonths ?? undefined,
      });
    }

    if (res?.success) {
      router.push(`/sr-Latn/onboarding?step=${currentStep + 1}`);
    } else {
      // Use window.alert as a fallback instead of toast
      window.alert(res?.error || "Greška");
    }
  };

  const heading =
    regime === "frilenser"
      ? "Još malo da završimo podešavanje naloga..."
      : regime === "pausal"
        ? "Potrebne su nam još neke informacije..."
        : "Potrebno nam je još par brojeva...";

  return (
    <div className="w-full h-full flex flex-col text-primary justify-between">
      <h1 className="text-primary text-2xl font-semibold w-full text-center uppercase tracking-wider">
        {heading}
      </h1>
      {regime === "frilenser" ? (
        <div className="w-full flex flex-col gap-4 items-center h-full justify-center">
          <FrilenserCard3
            activeMonths={activeMonths}
            setActiveMonths={setActiveMonths}
            setGrossAnnualIncome={setGrossAnnualIncome}
            isLessThan40={isLessThan40}
            setIsLessThan40={setIsLessThan40}
          />
        </div>
      ) : regime === "pausal" ? (
        <div className="w-full flex flex-col gap-4 items-center h-full justify-center">
          <PausalCard3
            municipality={municipality}
            setMunicipality={setMunicipality}
            setAverageAnnualSalary={setAverageAnnualSalary}
            setNumberOfClients={setNumberOfClients}
            setEmployeeCount={setEmployeeCount}
            isLessThan40={isLessThan40}
            setIsLessThan40={setIsLessThan40}
            activeMonths={activeMonths}
            setActiveMonths={setActiveMonths}
          />
        </div>
      ) : regime === "knjigas" ? (
        <div className="w-full flex flex-col gap-4 items-center h-full justify-center">
          <KnjigasCard3
            isPayingPersonalSalary={isPayingPersonalSalary}
            setIsPayingPersonalSalary={setIsPayingPersonalSalary}
            setPersonalSalary={setPersonalSalary}
            setAverageAnnualSalary={setAverageAnnualSalary}
            setNumberOfClients={setNumberOfClients}
            isLessThan40={isLessThan40}
            setIsLessThan40={setIsLessThan40}
            activeMonths={activeMonths}
            setActiveMonths={setActiveMonths}
          />
        </div>
      ) : null}

      <WizardNavigationButtons
        handleProceed={handleProceed}
        currentStep={currentStep}
      />
    </div>
  );
}

// TODO: Refactor this component
// >>>>> Add updateStepThree.ts action
