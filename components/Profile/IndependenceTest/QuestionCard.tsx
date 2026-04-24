import { Question } from "@/app/[locale]/(main)/profile/independence-test/page";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionCardProps {
  question: Question;
  index: number;
  answer: boolean | undefined;
  isLogicOpen: boolean;
  onAnswer: (id: number, value: boolean) => void;
  onToggleLogic: (id: number) => void;
}

export default function QuestionCard({
  question,
  index,
  answer,
  isLogicOpen,
  onAnswer,
  onToggleLogic,
}: QuestionCardProps) {
  const isYes = answer === true;
  const isNo = answer === false;

  return (
    <motion.div
      layout
      className={[
        "relative flex flex-col justify-between rounded-xl border p-3 transition-all ",
        "bg-[var(--bg-elevated)] min-h-[200px]",
        isYes
          ? "border-[var(--accent-green)]"
          : isNo
            ? "border-[var(--accent-red)]"
            : "border-[var(--border-default)]",
      ].join(" ")}
    >
      {/* Top */}
      <div>
        {/* Number */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--text-tertiary)]">
            #{index + 1}
          </span>

          {(isYes || isNo) && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs font-semibold"
            >
              {isYes ? "✔" : "✖"}
            </motion.span>
          )}
        </div>

        {/* Title */}
        <p className="mb-1 text-lg font-semibold text-[var(--text-primary)]">
          {question.title}
        </p>

        {/* Description */}
        <p className="text-base text-[var(--text-secondary)]">
          {question.description}
        </p>
      </div>

      {/* Bottom */}
      <div className="mt-3">
        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onAnswer(question.id, true)}
            className={[
              "flex-1 rounded-md border py-1.5 text-xs font-semibold transition",
              isYes
                ? "bg-[var(--tag-income-text)]/20 border-[var(--accent-green)] text-[var(--accent-green)]"
                : "border-[var(--border-interactive)] hover:border-[var(--accent-green)] text-primary hover:text-(--accent-green)",
            ].join(" ")}
          >
            Da
          </button>

          <button
            onClick={() => onAnswer(question.id, false)}
            className={[
              "flex-1 rounded-md border py-1.5 text-xs font-semibold transition",
              isNo
                ? "bg-[var(--tag-expense-text)]/20 border-[var(--accent-red)] text-[var(--accent-red)]"
                : "border-[var(--border-interactive)] hover:border-[var(--accent-red)] text-primary hover:text-(--accent-red)",
            ].join(" ")}
          >
            Ne
          </button>
        </div>

        {/* Logic toggle */}
        <button
          onClick={() => onToggleLogic(question.id)}
          className="mt-2 text-[11px] text-[var(--accent-cyan)]"
        >
          {isLogicOpen ? "Sakrij" : "Zašto?"}
        </button>

        {/* Logic animated */}
        <AnimatePresence>
          {isLogicOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden rounded-md border border-[var(--border-default)] bg-[var(--bg-main)] p-2 text-sm primary-slate"
            >
              💡 {question.logic}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
