import CashFlow from "./CashFlow";
import ProjectProfitability from "./ProjectProfitability";
import RecentTransactions from "./RecentTransactions";
import SafeToSpend from "./SafeToSpend";
import GoalsCardClient from "./GoalsCardClient";
import TransactionSimulator from "./TransactionSimulator";

export default function FinanceMain() {
  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2 md:gap-4 h-full">
        <SafeToSpend />
        <div className="w-full h-full md:col-span-2">
          <div className="flex flex-col gap-2 md:gap-4 w-full h-full">
            <CashFlow />
            <div className="flex gap-2 md:gap-4 w-full h-full md:flex-row flex-col">
              <GoalsCardClient />
              <TransactionSimulator />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full md:h-[310px] flex md:flex-row flex-col justify-between items-center gap-2 md:gap-4">
        <ProjectProfitability />
        <RecentTransactions />
      </div>
    </div>
  );
}
