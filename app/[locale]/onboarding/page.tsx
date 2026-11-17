"use client";
import { usePathname } from "next/navigation";

import SerbianTaxWizard from "@/components/Wizard/SRB/SerbianTaxWizard";
import Header from "@/components/Header";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
// import USATaxWizard from "@/components/Wizard/USA/USATaxWizard";

export default function OnboardingPage() {
  const pathname = usePathname();
  const t = useTranslations("navigation");

  const isSerbian = pathname.includes("sr-Latn");
  // const isUSA = pathname.includes("en");

  return (
    <div className="w-full min-h-screen h-full flex flex-col relative bg-[#0A0A0B]">
      <header className="flex justify-between w-full border-b background-border">
        <h1 className="text-sm font-bold uppercase text-primary text-center tracking-wider px-4 flex items-center justify-center">
          <Image src="/freehub-logo.png" alt="" width={52} height={52} />
          <span className="text-primary">{t("freehub")}</span>
        </h1>
        <Link
          href="/dashboard"
          className="text-slate-400 text-sm flex items-center px-4 hover:text-white transition-colors cursor-pointer"
        >
          Preskoci za sada
        </Link>
      </header>
      {/* {isSerbian ? <SerbianTaxWizard /> : isUSA ? <USATaxWizard /> : null} */}

      <SerbianTaxWizard />
    </div>
  );
}
