"use client";
import { useWizardStore } from "@/lib/store/useWizardStore";
import { useState } from "react";
import IndependenceTest from "@/components/Wizard/SRB/IndependenceTest";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import FrilenserSummary from "./FrilenserSummary";
import OtherSummary from "./OtherSummary";
import Freelancer from "./Freelancer";
import Pausal from "./Pausal";
import Knjigas from "./Knjigas";
import Doo from "./Doo";
import Employee from "./Employee";
import Hybrid from "./Hybrid";

function IndependencePrompt({
  onYes,
  onNo,
}: {
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <div className="w-full max-w-md bg-(--background-elevated) border border-(--background-border) rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
          01
        </span>
        <ShieldCheck size={15} className="text-(--accent-cyan) opacity-70" />
        <h2 className="text-primary text-base font-semibold">
          Test nezavisnosti
        </h2>
      </div>

      <p className="text-sm text-primary opacity-60 leading-relaxed">
        Test nezavisnosti utvrđuje da li vaš odnos sa klijentom može biti
        okarakterisan kao zavisni radni odnos — što direktno utiče na vaše
        poreske obaveze.
      </p>

      <div className="flex gap-3 w-full">
        <button
          onClick={onYes}
          className="flex-1 py-3 rounded-xl border font-semibold text-sm transition-all duration-200
            bg-(--accent-cyan)/20 border-(--accent-cyan) text-(--accent-cyan) hover:bg-(--accent-cyan)/30"
        >
          Da, uradi test
        </button>
        <button
          onClick={onNo}
          className="flex-1 py-3 rounded-xl border font-semibold text-sm transition-all duration-200
            bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
        >
          Preskoči
        </button>
      </div>
    </div>
  );
}

// ─── finish button ────────────────────────────────────────────────────────────

function FinishButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full max-w-md background-elevated hover:border-(--accent-cyan) hover:bg-(--accent-cyan)/20 hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
    >
      Završi <ArrowRight size={20} />
    </button>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function SRBStepFour() {
  const { regime } = useWizardStore();
  const router = useRouter();

  // null = not decided yet, true = yes, false = skipped
  const [doIndependenceTest, setDoIndependenceTest] = useState<boolean | null>(
    null,
  );

  const isFrilenser = regime === "freelancer";
  // const showResults =
  //   isFrilenser ||
  //   doIndependenceTest === false ||
  //   (doIndependenceTest === true && taxProfile?.independenceTestScore !== null);

  // GLOBAL TAX PROFILE - CountryTaxProfile shape, used for tax calculations app-wide
  const finish = async () => {
    router.push("/sr-Latn/dashboard");
  };

  return (
    <div className="w-full h-full flex flex-col items-center text-primary gap-6 justify-between">
      {/* Header */}
      <div>
        {regime === "freelancer" ? (
          <Freelancer />
        ) : regime === "pausal" ? (
          <Pausal />
        ) : regime === "knjigas" ? (
          <Knjigas />
        ) : regime === "d.o.o." ? (
          <Doo />
        ) : regime === "employee" ? (
          <Employee />
        ) : regime === "hybrid" ? (
          <Hybrid />
        ) : null}
      </div>
    </div>
  );
}
