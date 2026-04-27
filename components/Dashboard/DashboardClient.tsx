"use client";

import ClientsCard from "@/components/Dashboard/ClientsCard";
import FinancesCard from "@/components/Dashboard/FinancesCard";
import ProjectsCard from "@/components/Dashboard/ProjectsCard";
import { useIndependenceTestStore } from "@/lib/store/useIndependenceTestStore";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { ArrowRightFromLine } from "lucide-react";
import Link from "next/link";

export default function DashboardClient() {
  const { profile } = useTaxProfileStore();
  const { showFlag, setShowFlag } = useIndependenceTestStore();

  const testAlert =
    !!profile &&
    profile.country === "Serbia" &&
    profile.regime !== "frilenser" &&
    !profile.independenceTestCalculatedAt;

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full flex flex-col gap-4 primary-slate relative">
        {testAlert &&
          profile &&
          profile.country === "Serbia" &&
          profile.regime !== "frilenser" &&
          showFlag && (
            <div className="bg-(--bg-elevated) border border-(--accent-amber) p-4 rounded-2xl absolute bottom-16">
              {!profile.independenceTestCalculatedAt && (
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => setShowFlag(false)}
                    className="text-sm primary-red font-semibold uppercase tracking-wide border border-(--text-primary) hover:border-(--accent-red) px-4 py-2 rounded-lg hover:text-(--text-primary) hover:bg-(--accent-red)/10 transition-all duration-200 cursor-pointer"
                  >
                    Ne prikazuj više.
                  </button>
                  <h1 className="text-xl primary-amber font-bold text-center px-4">
                    Primetili smo da niste uradili test nezavisnosti. Da bismo
                    vam pomogli da iskoristite sve mogućnosti Freehuba,
                    preporučujemo da uradite test nezavisnosti. Ako želite,
                    možete ga preskočiti, ali imajte na umu da će vam test
                    pomoći da bolje razumete svoje poreske obaveze i kako da ih
                    optimizujete.
                  </h1>
                  <Link
                    href="/profile/independence-test"
                    className="text-xl font-bold uppercase hover:underline hover:text-(--accent-cyan) transition-all duration-300 flex items-center gap-2"
                  >
                    Idi na test nezavisnosti
                    <ArrowRightFromLine className="w-6 h-6" />
                  </Link>
                </div>
              )}
            </div>
          )}
        <div className="flex flex-col xl:flex-row gap-4 xl:h-[550px]">
          <FinancesCard />
          <ClientsCard />
          <ProjectsCard />
        </div>
      </div>
    </div>
  );
}
