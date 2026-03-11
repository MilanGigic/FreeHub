import { Conservativeness, Transaction } from "@/types/types";

const MULTIPLIERS: Record<Conservativeness, number> = {
  conservative: 0.5,
  moderate: 0.75,
  aggressive: 1.0,
};

export function calculateSavedAmount(
  transactions: Transaction[],
  conservativeness: Conservativeness,
): number {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return totalIncome * MULTIPLIERS[conservativeness];
}

export function calculateWeeklyTarget(
  targetAmount: number,
  savedAmount: number,
  deadline: Date | null,
): number | null {
  if (!deadline) return null;
  const weeksLeft = Math.max(
    1,
    (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7),
  );
  return Math.max(0, targetAmount - savedAmount) / weeksLeft;
}
