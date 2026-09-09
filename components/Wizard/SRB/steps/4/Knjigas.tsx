import WizardNavigationButtons from "@/components/Wizard/WizardNavigationButtons";
import { useWizardStore } from "@/lib/store/useWizardStore";
import { useRouter, useSearchParams } from "next/navigation";
import { MouseEvent } from "react";

export default function Knjigas() {
  const {
    payPersonalSalary,
    setPayPersonalSalary,
    trackingBusinessExpenses,
    setTrackingBusinessExpenses,
    setPersonalSalary,
  } = useWizardStore();

  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "1");
  const router = useRouter();

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (payPersonalSalary === null || trackingBusinessExpenses === null)
      return null;

    router.push("/sr-Latn/onboarding?step=4");
  };
  return (
    <div className="flex flex-col items-center w-full text-center gap-4 p-2">
      <div className="flex flex-col items-center w-full text-center gap-4 p-2">
        <h1 className="text-xl font-semibold uppercase">
          Do you pay yourself a personal salary?
        </h1>
        <div className="flex items-center gap-4 p-2">
          <button
            onClick={() => setPayPersonalSalary(true)}
            className={`py-2 px-4 border ${payPersonalSalary ? "bg-yellow-200/35" : ""}`}
          >
            Yes
          </button>
          <button
            onClick={() => setPayPersonalSalary(false)}
            className={`py-2 px-4 border ${payPersonalSalary !== null && payPersonalSalary === false ? "bg-yellow-200/35" : ""}`}
          >
            No
          </button>

          {payPersonalSalary && (
            <input
              type="number"
              placeholder="How much gross per month..."
              onChange={(e) => setPersonalSalary(Number(e.target.value))}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col items-center w-full text-center gap-4 p-2">
        <h1 className="text-xl font-semibold uppercase">
          Do you track business expenses?
        </h1>
        <div className="flex items-center gap-4 p-2">
          <button
            onClick={() => setTrackingBusinessExpenses(true)}
            className={`py-2 px-4 border ${trackingBusinessExpenses ? "bg-yellow-200/35" : ""}`}
          >
            Yes
          </button>
          <button
            onClick={() => setTrackingBusinessExpenses(false)}
            className={`py-2 px-4 border ${trackingBusinessExpenses !== null && trackingBusinessExpenses === false ? "bg-yellow-200/35" : ""}`}
          >
            No
          </button>
        </div>
      </div>
      <WizardNavigationButtons
        handleProceed={handleProceed}
        currentStep={currentStep}
      />
    </div>
  );
}
