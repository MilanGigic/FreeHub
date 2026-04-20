"use client";

import ClientsCard from "@/components/Dashboard/ClientsCard";
import FinancesCard from "@/components/Dashboard/FinancesCard";
import ProjectsCard from "@/components/Dashboard/ProjectsCard";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";

export default function DashboardClient() {
  const { profile } = useTaxProfileStore();

  if (profile) {
    if (profile.country === "Serbia") {
      if (profile.regime !== "frilenser") {
        if (
          profile.independenceTestScore === null ||
          profile.independenceTestScore === 0
        ) {
          return (
            <div className="w-full h-full">
              {/* FINISH AND POLISH UP THIS UI - IT SHOULD CHECK IF THERE IS INDEPENDENCE TEST SCORE AND IF NOT, SHOW THIS UI AND ASK THEM TO DO THE TEST - IT CAN OF COURSE BE OPTIONAL AND IF THEY WANT TO SKIP IT, THEY CAN DO SO */}

              {/* <h1>
              Ako želite da iskoristite sve mogućnosti FREEHUB-a, molimo vas da
              uradite test nezavisnosti.
              </h1>

            <Link href="/sr-Latn/dashboard/independence-test">
              Uradi test nezavisnosti
              </Link> */}
            </div>
          );
        }
      }
    }
  }

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full flex flex-col gap-4 primary-slate">
        <div className="flex flex-col xl:flex-row gap-4 xl:h-[550px]">
          <FinancesCard />
          <ClientsCard />
          <ProjectsCard />
        </div>
      </div>
    </div>
  );
}
