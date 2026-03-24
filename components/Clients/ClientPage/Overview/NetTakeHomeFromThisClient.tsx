import { useClientStore } from "@/lib/store/useClientStore";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";

export default function NetTakeHomeFromThisClient() {
  const { clientProjects } = useClientStore();
  const { effectiveTaxRate } = useTaxProfileStore();

  const clientRevenue = clientProjects.reduce(
    (acc, p) => acc + Number(p.totalRevenue || 0),
    0,
  );
  const clientExpenses = clientProjects.reduce(
    (acc, p) => acc + Number(p.totalExpenses || 0),
    0,
  );
  const clientProfit = clientRevenue - clientExpenses;
  const clientTax = clientRevenue * effectiveTaxRate;
  const netTakeHome = clientProfit - clientTax;

  return (
    <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          Net Take-Home from This Client
        </h1>
        <p className="text-2xl font-bold primary-cyan">
          ${netTakeHome.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </p>
        <p className="text-sm primary-slate">
          Net take-home from this client is the amount of money that is left
          after all expenses and taxes are paid.
        </p>
      </div>
    </div>
  );
}
