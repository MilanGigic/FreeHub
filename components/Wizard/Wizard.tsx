"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeToggle from "../ThemeToggle";

type WizardProps = {
  steps: React.ReactNode[];
  totalSteps?: number;
};

export default function Wizard({ steps, totalSteps }: WizardProps) {
  const t = useTranslations("wizard");
  const searchParams = useSearchParams();

  // URL is 1-indexed (?step=1, ?step=2, ?step=3)
  // Array is 0-indexed — subtract 1 when indexing
  const currentStep = parseInt(searchParams.get("step") || "1");
  const currentIndex = currentStep - 1;
  const progressSteps = Math.max(totalSteps ?? steps.length, 1);

  return (
    <div className="min-h-screen h-full w-full flex items-center justify-center p-4">
      <div className="flex flex-col w-full min-h-screen max-w-7xl background-elevated border background-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <ThemeToggle />
        </div>

        {/* Progress Bar */}
        {currentStep > 1 ? (
          <div className="flex gap-2 mb-8">
            {Array.from({ length: progressSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  index < currentStep ? "bg-emerald-500" : "bg-zinc-700"
                }`}
              />
            ))}
          </div>
        ) : null}

        <div className="flex-1 overflow-auto h-full">
          {steps[currentIndex] || null}
        </div>
      </div>
    </div>
  );
}
