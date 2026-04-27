import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────

const TOTAL_QUESTIONS = 9;

type Answers = Record<number, boolean>;

export interface TestResult {
  yesCount: number;
  isIndependent: boolean;
}

interface IndependenceTestState {
  // ── State ──
  answers: Answers;
  expandedLogic: number | null;
  submitted: boolean;
  showFlag: boolean;
  setShowFlag: (show: boolean) => void;

  // ── Derived (computed getters) ──
  answeredCount: () => number;
  yesCount: () => number;
  allAnswered: () => boolean;
  isIndependent: () => boolean;
  progressPercent: () => number;
  result: () => TestResult;

  // ── Actions ──
  setAnswer: (id: number, value: boolean) => void;
  toggleLogic: (id: number) => void;
  submit: () => void;
  reset: () => void;
}

const initialState = {
  answers: {} as Answers,
  expandedLogic: null as number | null,
  submitted: false,
};

export const useIndependenceTestStore = create<IndependenceTestState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      showFlag: true,
      setShowFlag: (show: boolean) => set({ showFlag: show }),

      // ── Derived ──────────────────────────────────────────────────────────────

      answeredCount: () => Object.keys(get().answers).length,

      yesCount: () => Object.values(get().answers).filter(Boolean).length,

      allAnswered: () => Object.keys(get().answers).length === TOTAL_QUESTIONS,

      isIndependent: () => {
        const yesCount = Object.values(get().answers).filter(Boolean).length;
        return yesCount <= 4;
      },

      progressPercent: () => {
        const answered = Object.keys(get().answers).length;
        return (answered / TOTAL_QUESTIONS) * 100;
      },

      result: () => {
        const yesCount = Object.values(get().answers).filter(Boolean).length;
        return {
          yesCount,
          isIndependent: yesCount <= 4,
        };
      },

      // ── Actions ──────────────────────────────────────────────────────────────

      setAnswer: (id, value) =>
        set(
          (state) => ({ answers: { ...state.answers, [id]: value } }),
          false,
          "setAnswer",
        ),

      toggleLogic: (id) =>
        set(
          (state) => ({
            expandedLogic: state.expandedLogic === id ? null : id,
          }),
          false,
          "toggleLogic",
        ),

      submit: () => {
        if (!get().allAnswered()) return;
        set({ submitted: true }, false, "submit");
      },

      reset: () => set(initialState, false, "reset"),
    }),
    { name: "IndependenceTestStore" },
  ),
);
