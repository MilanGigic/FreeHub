export type SimulationInput = {
  type: "income" | "expense";
  amount: number;
  isRecurring: boolean;
  note: string;
  deductible: boolean;
  merchant: string | null;
  title: string | null;
  projectId: string | null;
  clientId: string | null;
  transactionDate: string | null;
};

export type SimulationResult = {
  newSafeToSpend: number;
  netProfitChange: number;
  cashBufferDays: number;
  monthlyImpact: number;
  annualImpact: number;
};

export function simulate(
  input: SimulationInput,
  current: {
    amount: number;
    netProfit: number;
    monthlyExpenses: number;
    taxRate: number; // 0–1 e.g. 0.25
  },
): SimulationResult {
  const sign = input.type === "income" ? 1 : -1;
  const taxImpact =
    input.type === "income" ? input.amount * current.taxRate : 0;
  const netChange = sign * input.amount - taxImpact;

  const newSafeToSpend = current.amount + netChange;
  const netProfitChange = netChange;

  const monthlyExpensesAfter =
    input.type === "expense" && input.isRecurring
      ? current.monthlyExpenses + input.amount
      : current.monthlyExpenses;

  const cashBufferDays =
    monthlyExpensesAfter > 0
      ? Math.floor((newSafeToSpend / monthlyExpensesAfter) * 30)
      : 999;

  const monthlyImpact = input.isRecurring ? sign * input.amount : 0;
  const annualImpact = input.isRecurring
    ? sign * input.amount * 12
    : sign * input.amount;

  return {
    newSafeToSpend,
    netProfitChange,
    cashBufferDays,
    monthlyImpact,
    annualImpact,
  };
}
