"use client";

import { fetchTaxProfile } from "@/actions/taxProfile/fetchTaxProfile";
import { useAuth } from "@/lib/useAuth";
import { TaxProfile } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export default function USAStepFive() {
  const { user } = useAuth();
  const [taxProfile, setTaxProfile] = useState<TaxProfile | null>(null);
  const router = useRouter();
  const t = useTranslations("wizard");
  const tCommon = useTranslations("common");

  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await fetchTaxProfile(user?.id);
      if (res.success) {
        if (res.taxProfile) {
          setTaxProfile({
            entityType: res.taxProfile.entityType,
            filingStatus: res.taxProfile.filingStatus,
            stateResidence: res.taxProfile.stateResidence,
            homeOfficeSqft: res.taxProfile.homeOfficeSqft,
            homeOfficeSimplified: res.taxProfile.homeOfficeSimplified,
            mileageTracking: res.taxProfile.mileageTracking,
            healthInsuranceDeduction: res.taxProfile.healthInsuranceDeduction,
            retirementContribution: res.taxProfile.retirementContribution,
          });
        }
      } else {
        console.error("Error fetching tax profile:", res.error);
        toast.error(res.error);
      }
    })();
  }, [user]);
  return (
    <div className="w-full h-full flex flex-col justify-between items-center primary-slate p-4">
      <div className="flex flex-col gap-2 items-center text-primary text-lg font-semibold">
        <h1 className="text-2xl font-bold text-primary">{t("welcomeTitle")}</h1>
        <p className="text-sm primary-slate">{t("welcomeSubtitle")}</p>
      </div>

      <div className="text-center flex flex-col gap-2 items-center">
        <h1 className="text-5xl font-bold primary-cyan">{t("allSetUp")}</h1>
        <p className="text-xl text-primary">{t("proceedToDashboard")}</p>
        <p className="text-lg primary-slate">{t("changeInSettings")}</p>

        <div className="grid grid-cols-4 gap-2">
          <h1 className="col-span-4 text-center text-2xl font-bold primary-cyan">
            {t("taxProfile")}
          </h1>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            {t("entityType")}{" "}
            <span className="font-normal text-primary">
              {taxProfile?.entityType}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            {t("filingStatusLabel")}{" "}
            <span className="font-normal text-primary">
              {taxProfile?.filingStatus}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            {t("stateResidence")}{" "}
            <span className="font-normal text-primary">
              {taxProfile?.stateResidence}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            {t("homeOfficeSimplified")}{" "}
            <span className="font-normal text-primary">
              {taxProfile?.homeOfficeSimplified
                ? tCommon("yes")
                : tCommon("no")}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            {t("homeOfficeSqft")}{" "}
            <span className="font-normal text-primary">
              {taxProfile?.homeOfficeSqft}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            {t("mileageTracking")}{" "}
            <span className="font-normal text-primary">
              {taxProfile?.mileageTracking ? tCommon("yes") : tCommon("no")}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            {t("healthInsuranceDeduction")}{" "}
            <span className="font-normal text-primary">
              {taxProfile?.healthInsuranceDeduction
                ? tCommon("yes")
                : tCommon("no")}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            {t("retirementContribution")}{" "}
            <span className="font-normal text-primary">
              {taxProfile?.retirementContribution
                ? tCommon("yes")
                : tCommon("no")}
            </span>
          </p>
        </div>
      </div>

      <div>
        <button
          onClick={() => router.push("/dashboard")}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2"
        >
          {t("proceedToDashboardButton")}
        </button>
      </div>
    </div>
  );
}
