"use client";
import { useWizardStore } from "@/lib/store/useWizardStore";
import { useEffect, useState } from "react";
import IndependenceTest from "@/components/Wizard/SRB/IndependenceTest";
import { useAuth } from "@/lib/useAuth";
import { fetchTaxProfile } from "@/actions/taxProfile/fetchTaxProfile";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import FrilenserSummary from "./FrilenserSummary";
import OtherSummary from "./OtherSummary";

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
  const { user } = useAuth();
  const { regime, taxProfile, setTaxProfile } = useWizardStore();
  const router = useRouter();

  // null = not decided yet, true = yes, false = skipped
  const [doIndependenceTest, setDoIndependenceTest] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await fetchTaxProfile(user.id);
      if (res.success && res.taxProfile) setTaxProfile(res.taxProfile);
    })();
  }, [setTaxProfile, user]);

  const isFrilenser = regime === "frilenser";
  const showResults =
    isFrilenser ||
    doIndependenceTest === false ||
    (doIndependenceTest === true && taxProfile?.independenceTestScore !== null);

  return (
    <div className="w-full h-full flex flex-col items-center text-primary gap-6 justify-between">
      {/* Header */}
      <div className="flex flex-col items-center gap-1 w-full">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 size={20} className="text-(--accent-cyan)" />
          <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan)">
            Onboarding završen
          </span>
        </div>
        <h1 className="text-primary text-2xl font-semibold text-center tracking-wide">
          {isFrilenser ? "Evo vaših rezultata!" : "Pregled vašeg profila"}
        </h1>
        <p className="text-primary opacity-40 text-sm text-center max-w-sm">
          {isFrilenser
            ? "Na osnovu unetih podataka, ovo je vaš poreski profil."
            : "Pregledajte vaše podatke i opciono uradite test nezavisnosti."}
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-4 w-full flex-1 overflow-auto">
        {isFrilenser && taxProfile && <FrilenserSummary p={taxProfile} />}

        {!isFrilenser && doIndependenceTest === null && (
          <IndependencePrompt
            onYes={() => setDoIndependenceTest(true)}
            onNo={() => setDoIndependenceTest(false)}
          />
        )}

        {!isFrilenser && doIndependenceTest === true && (
          <IndependenceTest onClose={() => setDoIndependenceTest(null)} />
        )}

        {!isFrilenser && doIndependenceTest === false && taxProfile && (
          <OtherSummary p={taxProfile} />
        )}
      </div>

      {/* Footer actions */}
      {showResults && (
        <FinishButton onClick={() => router.push("/sr-Latn/dashboard")} />
      )}
    </div>
  );
}
