"use client";

import { fetchTaxProfile } from "@/actions/taxProfile/fetchTaxProfile";
import { useAuth } from "@/lib/useAuth";
import { TaxProfile } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function StepFive() {
  const { user } = useAuth();
  const [taxProfile, setTaxProfile] = useState<TaxProfile | null>(null);
  const router = useRouter();

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
        <h1 className="text-2xl font-bold text-primary">Welcome to Efficio</h1>
        <p className="text-sm primary-slate">
          Let&apos;s get you set up with your account.
        </p>
      </div>

      <div className="text-center flex flex-col gap-2 items-center">
        <h1 className="text-5xl font-bold primary-cyan">
          You&apos;re all set up!
        </h1>
        <p className="text-xl text-primary">
          You can now proceed to the dashboard.
        </p>
        <p className="text-lg primary-slate">
          You can always change your answers in the account settings.
        </p>

        <div className="grid grid-cols-4 gap-2">
          <h1 className="col-span-4 text-center text-2xl font-bold primary-cyan">
            Here is your tax profile:
          </h1>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            Entity Type:{" "}
            <span className="font-normal text-primary">
              {taxProfile?.entityType}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            Filing Status:{" "}
            <span className="font-normal text-primary">
              {taxProfile?.filingStatus}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            State Residence:{" "}
            <span className="font-normal text-primary">
              {taxProfile?.stateResidence}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            Home Office Simplified:{" "}
            <span className="font-normal text-primary">
              {taxProfile?.homeOfficeSimplified ? "Yes" : "No"}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            Home Office Sqft:{" "}
            <span className="font-normal text-primary">
              {taxProfile?.homeOfficeSqft}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            Mileage Tracking:{" "}
            <span className="font-normal text-primary">
              {taxProfile?.mileageTracking ? "Yes" : "No"}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            Health Insurance Deduction:{" "}
            <span className="font-normal text-primary">
              {taxProfile?.healthInsuranceDeduction ? "Yes" : "No"}
            </span>
          </p>
          <p className="flex flex-col gap-2 border background-border rounded-lg p-4 background-elevated primary-slate text-lg font-semibold">
            Retirement Contribution:{" "}
            <span className="font-normal text-primary">
              {taxProfile?.retirementContribution ? "Yes" : "No"}
            </span>
          </p>
        </div>
      </div>

      <div>
        <button
          onClick={() => router.push("/dashboard")}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2"
        >
          Proceed to dashboard
        </button>
      </div>
    </div>
  );
}
