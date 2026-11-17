"use client";

import ClientsCard from "@/components/Dashboard/ClientsCard";
import FinancesCard from "@/components/Dashboard/FinancesCard";
import ProjectsCard from "@/components/Dashboard/ProjectsCard";
import { useIndependenceTestStore } from "@/lib/store/useIndependenceTestStore";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { ArrowRightFromLine, ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function DashboardClient() {
  const { profile } = useTaxProfileStore();
  const { showFlag, setShowFlag } = useIndependenceTestStore();
  const t = useTranslations("dashboard");

  const testAlert =
    !!profile &&
    profile.country === "Serbia" &&
    profile.currentRegime !== "freelancer" &&
    !profile.independenceTestCalculatedAt;

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full flex flex-col gap-4 primary-slate relative">
        {testAlert &&
          profile &&
          profile.country === "Serbia" &&
          profile.currentRegime !== "freelancer" &&
          showFlag && (
            <div className="w-full max-w-3xl self-center bg-(--bg-elevated) border border-(--accent-amber) p-3 sm:p-4 rounded-2xl">
              {!profile.independenceTestCalculatedAt && (
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={() => setShowFlag(false)}
                    className="text-xs sm:text-sm primary-red font-semibold uppercase tracking-wide border border-(--text-primary) hover:border-(--accent-red) px-3 sm:px-4 py-2 rounded-lg hover:text-(--text-primary) hover:bg-(--accent-red)/10 transition-all duration-200 cursor-pointer"
                  >
                    Ne prikazuj više.
                  </button>
                  <h1 className="text-base sm:text-lg lg:text-xl primary-amber font-bold text-center px-1 sm:px-4">
                    Primetili smo da niste uradili test nezavisnosti. Da bismo
                    vam pomogli da iskoristite sve mogućnosti Freehuba,
                    preporučujemo da uradite test nezavisnosti. Ako želite,
                    možete ga preskočiti, ali imajte na umu da će vam test
                    pomoći da bolje razumete svoje poreske obaveze i kako da ih
                    optimizujete.
                  </h1>
                  <Link
                    href="/profile/independence-test"
                    className="text-base sm:text-lg font-bold uppercase hover:underline hover:text-(--accent-cyan) transition-all duration-300 flex items-center gap-2"
                  >
                    Idi na test nezavisnosti
                    <ArrowRightFromLine className="w-5 h-5 shrink-0 sm:w-6 sm:h-6" />
                  </Link>
                </div>
              )}
            </div>
          )}
        <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-10 xl:p-16">
          <div className="flex flex-col gap-4 pb-8 sm:pb-12 lg:pb-16 border-b background-border">
            <header className="w-full text-xs sm:text-sm flex flex-wrap items-center gap-2 background-border justify-between">
              <h1 className="tracking-widest text-tertiary uppercase">
                {t("financesOverview")}
              </h1>
              <Link
                href="/finances"
                className="flex items-center gap-1 text-center font-light hover:text-white transition-colors"
              >
                {t("goToFinances")} <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </header>
            <FinancesCard displayCurrency="RSD" />
          </div>
          <div className="flex flex-col gap-4 py-8 sm:py-12 lg:py-16 border-b background-border">
            <header className="w-full text-xs sm:text-sm flex flex-wrap items-center gap-2 background-border justify-between">
              <h1 className="tracking-widest text-tertiary uppercase">
                {t("clientsOverview")}
              </h1>
              <Link
                href="/clients"
                className="flex items-center gap-1 text-center font-light hover:text-white transition-colors"
              >
                {t("goToClients")} <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </header>
            <ClientsCard displayCurrency="RSD" />
          </div>
          <div className="flex flex-col gap-4 pt-8 sm:pt-12 lg:pt-16">
            <header className="w-full text-xs sm:text-sm flex flex-wrap items-center gap-2 background-border justify-between">
              <h1 className="tracking-widest text-tertiary uppercase">
                {t("projectsOverview")}
              </h1>
              <Link
                href="/projects"
                className="flex items-center gap-1 text-center font-light hover:text-white transition-colors"
              >
                {t("goToProjects")} <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </header>
            <ProjectsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
