"use client";

import { useWizardStore } from "@/lib/store/useWizardStore";
import {
  MUNICIPALITIES,
  MunicipalitySeed,
  pausalCards,
} from "@/config/constants";
import { MouseEvent, useState } from "react";
import { fetchMunicipality } from "@/actions/taxProfile/fetchMunicipality";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import WizardNavigationButtons from "@/components/Wizard/WizardNavigationButtons";

export default function Pausal() {
  const tOnboarding = useTranslations("onboarding.pausal");
  const [query, setQuery] = useState("");
  const [loadingMunicipality, setLoadingMunicipality] = useState(false);
  const [municipalityError, setMunicipalityError] = useState<string | null>(
    null,
  );
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "1");
  const router = useRouter();

  const filtered = MUNICIPALITIES.filter((m: MunicipalitySeed) =>
    m.name.toLowerCase().includes(query.toLowerCase()),
  );

  const {
    activityCode,
    setActivityCode,
    municipality,
    setMunicipality,
    haveMonthlyAmount,
    setHaveMonthlyAmount,
    monthlyAmount,
    setMonthlyAmount,
    setExpectedYearRevenue,
    setResenjeDate,
  } = useWizardStore();

  async function handleSelectMunicipality(code: string) {
    setQuery("");
    setMunicipalityError(null);
    setLoadingMunicipality(true);
    try {
      const data = await fetchMunicipality(code);
      setMunicipality(data.name);
    } catch (err) {
      console.error("Failed to fetch municipality:", err);
      setMunicipalityError(
        "Couldn't find that municipality — please try another.",
      );
    } finally {
      setLoadingMunicipality(false);
    }
  }
  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!activityCode || !municipality) return null;

    router.push("/sr-Latn/onboarding?step=4");
  };
  return (
    <div
      className={`flex flex-col items-center gap-4 w-full ${activityCode !== null && municipality !== null ? "border-b-2" : ""}`}
    >
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold uppercase">
          {tOnboarding("activityCodeTitle")}
        </h1>
        <div className="flex items-center gap-4 p-2">
          {pausalCards.map((card, index) => (
            <button
              key={index}
              className={`py-2 px-4 border ${card.title === activityCode ? "bg-orange-200/35" : ""}`}
              onClick={() => setActivityCode(card.title)}
            >
              {card.title}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold uppercase">
          {tOnboarding("municipalityTitle")} (
          {loadingMunicipality ? "loading…" : (municipality ?? "")})
        </h1>
        <div className="w-full flex flex-col gap-2 relative">
          <input
            placeholder="Počnite da kucate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-center py-2 px-4 border"
          />

          {query && (
            <div className="absolute top-full mt-1 w-full bg-(--background-elevated) border border-(--background-border) rounded-lg max-h-48 overflow-y-auto z-50">
              {filtered.length > 0 ? (
                filtered.map((m: MunicipalitySeed) => (
                  <div
                    key={m.code}
                    onClick={() => handleSelectMunicipality(m.code)}
                    className="px-4 py-2 border background-border rounded-lg hover:border-(--accent-cyan) cursor-pointer bg-(--background-elevated)/60 hover:bg-(--accent-cyan)/60 backdrop-blur-xs text-primary"
                  >
                    {m.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  {tOnboarding("municipalityError")}
                </div>
              )}
            </div>
          )}

          {municipalityError && (
            <p className="text-sm text-red-500">{municipalityError}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center w-full text-center gap-4 p-2">
        <h1 className="text-xl font-semibold uppercase">
          {tOnboarding("haveOfficialAmountTitle")}
        </h1>
        <div className="flex items-center gap-4 p-2">
          <button
            className={`py-2 px-4 border ${haveMonthlyAmount ? "bg-yellow-200/35" : ""}`}
            onClick={() => setHaveMonthlyAmount(true)}
          >
            Yes
          </button>
          <button
            className={`py-2 px-4 border ${!haveMonthlyAmount ? "bg-yellow-200/35" : ""}`}
            onClick={() => setHaveMonthlyAmount(false)}
          >
            No
          </button>
        </div>

        {haveMonthlyAmount ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center w-full text-center gap-4 p-2">
              <h1>{tOnboarding("resenjeDateTitle")}</h1>

              <input
                type="date"
                className="border px-4 py-2"
                onChange={(e) => setResenjeDate(new Date(e.target.value))}
              />
            </div>
            <div className="flex flex-col items-center w-full text-center gap-4 p-2">
              <h1>
                {tOnboarding("monthlyAmountTitle")}{" "}
                {monthlyAmount && monthlyAmount}
              </h1>

              <input
                type="number"
                className="border px-4 py-2 w-full"
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col items-center w-full text-center gap-4">
        <h1 className="text-xl font-semibold uppercase">
          {tOnboarding("expectedRevenueTitle")}
        </h1>
        <input
          type="number"
          placeholder="Enter your estimate earnings this year"
          className="border py-2 px-4 w-full text-center"
          onChange={(e) => setExpectedYearRevenue(Number(e.target.value))}
        />
      </div>

      <WizardNavigationButtons
        handleProceed={handleProceed}
        currentStep={currentStep}
      />
    </div>
  );
}
