"use client";

import QuestionCard from "@/components/Profile/IndependenceTest/QuestionCard";
import { motion } from "framer-motion";
import { useIndependenceTestStore } from "@/lib/store/useIndependenceTestStore";
import { useRouter } from "next/navigation";
import { updateIndependenceTest } from "@/actions/taxProfile/updateIndependenceTest";
import { CheckCircle, CheckIcon, TriangleAlert, XIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Question {
  id: number;
  title: string;
  description: string;
  logic: string;
}

interface TestResult {
  yesCount: number;
  isIndependent: boolean;
}

interface IndependenceTestProps {
  onComplete?: (result: TestResult) => void;
  onDismiss?: () => void;
}

type Answers = Record<number, boolean>;

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Određivanje radnog vremena i odmora",
    description:
      "Da li klijent određuje kada moraš biti „online”, kada počinješ i završavaš smenu, ili ti je potrebna njihova dozvola za godišnji odmor?",
    logic:
      "Pravi preduzetnik sam upravlja svojim vremenom i garantuje isporuku rezultata u roku, a ne prisustvo u određeno vreme.",
  },
  {
    id: 2,
    title: "Korišćenje prostorija i opreme klijenta",
    description:
      "Da li radiš iz kancelarije klijenta ili koristiš laptop, monitore i specifičan softver koji su oni platili?",
    logic:
      "Ako klijent obezbeđuje „sredstva za rad”, to ukazuje na odnos poslodavac-zaposleni. Samostalni preduzetnik ulaže u sopstvenu opremu.",
  },
  {
    id: 3,
    title: "Kontrola, obuka i rukovođenje",
    description:
      "Da li klijent organizuje tvoj radni proces, drži ti obavezne obuke o načinu rada ili imaš „menadžera” koji ti direktno naređuje kako da izvršiš zadatke?",
    logic:
      "Preduzetnik dobija nalog (šta treba uraditi), ali on sam odlučuje o metodologiji (kako će to uraditi).",
  },
  {
    id: 4,
    title: "Zabrana angažovanja podizvođača",
    description:
      "Da li u ugovoru piše da isključivo ti lično moraš da obaviš posao? Da li ti je zabranjeno da unajmiš drugu osobu ili firmu da ti pomogne?",
    logic:
      "Ako klijent insistira isključivo na tebi, to liči na ugovor o radu. Preduzetnik prodaje uslugu svoje firme, koju teoretski može izvršiti bilo ko stručan koga on angažuje.",
  },
  {
    id: 5,
    title: "Koncentracija prihoda (70% pravilo)",
    description:
      "Da li više od 70% tvog ukupnog prihoda u poslednjih 12 meseci dolazi od jednog klijenta?",
    logic:
      "Ovo je čisto finansijski kriterijum. Ako skoro sav novac dobijaš od jednog izvora, ekonomski si zavisan od njega kao zaposleni.",
  },
  {
    id: 6,
    title: "Rizik poslovanja",
    description:
      "Ko snosi štetu ako posao ne bude urađen kako treba? Da li ti o svom trošku popravljaš grešku ili klijent preuzima trošak?",
    logic:
      "Preduzetnik snosi poslovni rizik i odgovara svojom imovinom/profitom. Zaposleni dobija platu bez obzira na to da li je firma tog meseca u gubitku.",
  },
  {
    id: 7,
    title: "Zabrana konkurencije (Ekskluzivnost)",
    description:
      "Da li ti je ugovorom zabranjeno da radiš za bilo koga drugog ko se bavi sličnim poslom, čime ti je praktično onemogućeno da imaš druge klijente?",
    logic:
      "Ograničavanje preduzetnika da nalazi nove klijente je tipično za radni odnos gde zaposleni mora biti lojalan samo jednom poslodavcu.",
  },
  {
    id: 8,
    title: "Broj radnih dana (130 dana)",
    description:
      "Da li za tog klijenta radiš kontinuirano više od 130 radnih dana u toku jedne godine? (Otprilike 6 meseci punog radnog vremena).",
    logic:
      "Dugoročan, kontinuiran rad za jednog klijenta ukazuje na stalnu potrebu za tvojim radnim mestom, što je karakteristika zaposlenja.",
  },
  {
    id: 9,
    title: "Obezbeđivanje materijala i alata",
    description:
      "Da li klijent plaća troškove tvog interneta, licence za softvere (npr. Adobe, Jira, AWS) ili sirovine potrebne za rad?",
    logic:
      "Ako klijent pokriva tvoje operativne troškove, ti nemaš troškove poslovanja kao preduzetnik, već neto zaradu kao zaposleni.",
  },
];

const TOTAL = QUESTIONS.length;

// ─── Result screen ────────────────────────────────────────────────────────────

interface ResultScreenProps {
  yesCount: number;
  isIndependent: boolean;
}

function ResultScreen({ yesCount, isIndependent }: ResultScreenProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-2 py-2 text-center">
      {/* Icon */}

      {isIndependent ? (
        <CheckCircle className="w-[72px] h-[72px] text-(--accent-green)" />
      ) : (
        <TriangleAlert className="w-[72px] h-[72px] text-(--accent-red)" />
      )}

      {/* Verdict */}
      <div>
        <p
          className={[
            "mb-1.5 text-[11px] font-bold uppercase tracking-widest",
            isIndependent
              ? "text-[var(--accent-green)]"
              : "text-[var(--accent-red)]",
          ].join(" ")}
        >
          {isIndependent
            ? "Samostalan preduzetnik"
            : "Nesamostalan preduzetnik"}
        </p>
        <h3 className="mb-2 text-xl font-bold text-[var(--text-primary)]">
          {yesCount} od {TOTAL} odgovora &ldquo;Da&rdquo;
        </h3>
        <p className="mx-auto max-w-[420px] text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
          {isIndependent
            ? "Tvoj Path B (Paušalac/Knjigaš) je siguran. Poreska uprava te ne može tretirati kao zaposlenog."
            : "Poreska uprava te može tretirati kao zaposlenog i naplatiti ogromne razlike u porezima i doprinosima unazad. Sigurnije je koristiti Path A (Frilenser Model 1 ili 2)."}
        </p>
      </div>

      {/* Score breakdown */}
      <div className="flex w-full items-center justify-center gap-8 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-6 py-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-[var(--accent-red)]">
            {yesCount}
          </p>
          <p className="text-sm uppercase font-semibold text-[var(--text-tertiary)]">
            Da
          </p>
        </div>
        <div className="h-8 w-px bg-[var(--border-default)]" />
        <div className="text-center">
          <p className="text-2xl font-bold text-[var(--accent-green)]">
            {TOTAL - yesCount}
          </p>
          <p className="text-sm uppercase font-semibold text-[var(--text-tertiary)]">
            Ne
          </p>
        </div>
        <div className="h-8 w-px bg-[var(--border-default)]" />
        <div className="text-center flex flex-col items-center">
          <p
            className={[
              "text-2xl font-bold",
              isIndependent
                ? "text-[var(--accent-green)]"
                : "text-[var(--accent-red)]",
            ].join(" ")}
          >
            {isIndependent ? <CheckIcon /> : <XIcon />}
          </p>
          <p className="text-sm uppercase font-semibold text-[var(--text-tertiary)]">
            Rezultat
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IndependenceTestPage({
  onComplete,
  onDismiss,
}: IndependenceTestProps) {
  const router = useRouter();

  const {
    answers,
    expandedLogic,
    submitted,
    answeredCount,
    yesCount,
    allAnswered,
    isIndependent,
    progressPercent,
    setAnswer,
    toggleLogic,
    submit,
  } = useIndependenceTestStore();

  const handleSubmit = async () => {
    if (!allAnswered) return;
    submit(); // calls the store

    await updateIndependenceTest(yesCount(), new Date());

    onComplete?.({
      yesCount: yesCount(),
      isIndependent: isIndependent(),
    });
  };

  const handleDismiss = (): void => {
    onDismiss;

    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* ── Page Container ── */}
      <div className="w-full max-w-[1400px] mx-auto px-6 py-6">
        {/* ── Header ── */}
        <div className="mb-6">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="mb-0.5 text-[10.5px] font-bold uppercase tracking-widest text-[var(--accent-amber)]">
                Obavezan test
              </p>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                Test samostalnosti
              </h1>
              <p className="mt-1 text-[12px] text-[var(--text-tertiary)]">
                {answeredCount()} / {TOTAL}
              </p>
            </div>

            {onDismiss && (
              <button
                onClick={onDismiss}
                className="rounded p-1 text-xl text-[var(--text-tertiary)] hover:opacity-60"
              >
                ×
              </button>
            )}
          </div>

          {/* Progress */}
          <div className="h-[4px] overflow-hidden rounded-full bg-[var(--border-default)]">
            <motion.div
              className="h-full bg-[var(--accent-cyan)]"
              animate={{ width: `${progressPercent()}%` }}
              transition={{ type: "spring", stiffness: 80 }}
            />
          </div>
        </div>

        {/* ── Content ── */}
        {!submitted ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {QUESTIONS.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                answer={answers[q.id]}
                isLogicOpen={expandedLogic === q.id}
                onAnswer={setAnswer}
                onToggleLogic={toggleLogic}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ResultScreen
              yesCount={yesCount()}
              isIndependent={isIndependent()}
            />
          </motion.div>
        )}

        {/* ── Footer / CTA ── */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {!submitted ? (
            <>
              <button
                onClick={handleSubmit}
                disabled={!allAnswered()}
                className={[
                  "w-full max-w-sm rounded-lg px-6 py-3 text-[14px] font-semibold text-white transition-all",
                  allAnswered()
                    ? "bg-[var(--accent-cyan)] hover:opacity-90"
                    : "bg-[var(--border-default)] text-[var(--text-disabled)] cursor-not-allowed",
                ].join(" ")}
              >
                {allAnswered()
                  ? "Vidi rezultat →"
                  : `Još ${TOTAL - answeredCount()} pitanja`}
              </button>

              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-[13px] text-[var(--text-tertiary)] hover:opacity-70"
                >
                  Preskoči za sada
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => handleDismiss()}
              className="w-full max-w-sm rounded-lg bg-[var(--accent-cyan)] px-6 py-3 text-[14px] font-semibold text-white hover:opacity-90"
            >
              Zatvori
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
