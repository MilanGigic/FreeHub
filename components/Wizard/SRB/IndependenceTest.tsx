"use client";

import { useState } from "react";

export default function IndependenceTest({ onClose }: { onClose: () => void }) {
  const [independenceAnswers, setIndependenceAnswers] = useState<
    Record<string, boolean>
  >({});
  return (
    <div className="w-full max-w-md bg-(--background-elevated) border border-(--background-border) rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
          04
        </span>
        <h2 className="text-primary text-lg font-semibold">
          Test nezavisnosti
        </h2>
      </div>

      <p className="text-sm text-primary opacity-50 -mt-2">
        Odgovorite iskreno — rezultat utiče na vaš poreski status.
      </p>

      <div className="flex flex-col gap-3">
        {[
          {
            key: "workingHours",
            label: "Radno vreme i odmor",
            question:
              "Da li klijent određuje kada počinjete i završavate sa radom, ili kada možete da idete na odmor?",
          },
          {
            key: "equipment",
            label: "Prostorije i oprema",
            question:
              "Da li radite u prostorijama klijenta ili koristite opremu koju je on obezbedio?",
          },
          {
            key: "training",
            label: "Obuka i organizacija",
            question:
              "Da li vam klijent organizuje radni proces, drži obavezne obuke ili direktno rukovodi vašim zadacima?",
          },
          {
            key: "subcontractors",
            label: "Zabrana podizvođača",
            question:
              "Da li vam je ugovorom zabranjeno da angažujete podizvođače da završe deo posla umesto vas?",
          },
          {
            key: "incomeConcentration",
            label: "Koncentracija prihoda",
            question:
              "Da li više od 70% vaših prihoda u 12 meseci dolazi od jednog istog klijenta?",
          },
          {
            key: "businessRisk",
            label: "Poslovni rizik",
            question: "Da li klijent snosi sav rizik za posao koji obavljate?",
          },
          {
            key: "nonCompete",
            label: "Zabrana konkurencije",
            question:
              "Da li ugovor praktično onemogućava da radite za druge klijente?",
          },
          {
            key: "duration",
            label: "Trajanje angažovanja",
            question:
              "Da li ste za istog klijenta radili više od 130 radnih dana u poslednjih 12 meseci?",
          },
          {
            key: "materials",
            label: "Obezbeđivanje sredstava",
            question:
              "Da li klijent obezbeđuje sav materijal i sirovine potrebne za vaš rad?",
          },
        ].map((item, index) => (
          <div
            key={item.key}
            className="flex flex-col gap-2 p-4 rounded-xl border border-(--background-border) bg-(--background-base)"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-primary font-semibold text-sm">
                  {item.label}
                </p>
                <p className="text-primary opacity-50 text-xs leading-relaxed">
                  {item.question}
                </p>
              </div>

              <div className="flex gap-2 shrink-0 mt-1">
                <button
                  onClick={() =>
                    setIndependenceAnswers((prev) => ({
                      ...prev,
                      [item.key]: true,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all duration-200
                ${
                  independenceAnswers[item.key] === true
                    ? "bg-(--accent-red)/20 border-(--accent-red) text-(--accent-red)"
                    : "bg-transparent border-(--background-border) text-primary opacity-40 hover:opacity-70"
                }`}
                >
                  Da
                </button>
                <button
                  onClick={() =>
                    setIndependenceAnswers((prev) => ({
                      ...prev,
                      [item.key]: false,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all duration-200
                ${
                  independenceAnswers[item.key] === false
                    ? "bg-(--accent-cyan)/20 border-(--accent-cyan) text-(--accent-cyan)"
                    : "bg-transparent border-(--background-border) text-primary opacity-40 hover:opacity-70"
                }`}
                >
                  Ne
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live result indicator */}
      {Object.keys(independenceAnswers).length > 0 && (
        <div
          className={`mt-1 p-3 rounded-xl border text-sm font-medium text-center transition-all duration-300
      ${
        Object.values(independenceAnswers).filter(Boolean).length >= 5
          ? "bg-(--accent-red)/10 border-(--accent-red) text-(--accent-red)"
          : "bg-(--accent-cyan)/10 border-(--accent-cyan) text-(--accent-cyan)"
      }`}
        >
          {(() => {
            const yesCount =
              Object.values(independenceAnswers).filter(Boolean).length;
            if (yesCount >= 5)
              return `⚠ ${yesCount}/9 — Postoji rizik od zavisnog odnosa`;
            if (yesCount > 0)
              return `✓ ${yesCount}/9 — Uglavnom nezavisan odnos`;
            return `Odgovoreno: ${Object.keys(independenceAnswers).length}/9`;
          })()}
        </div>
      )}

      <button
        onClick={onClose}
        className="bg-(--accent-cyan)/20 border-(--accent-cyan) text-(--accent-cyan) px-4 py-2 rounded-md"
      >
        Zatvori
      </button>
    </div>
  );
}
