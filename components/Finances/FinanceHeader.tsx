"use client";

import { calculateUnpaidInvoices } from "@/actions/finances/calculateUnpaidInvoices";
import { fetchAllProjects } from "@/actions/projects/fetchAllProjects";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FinanceHeader() {
  const { user } = useAuth();
  const { taxReserved, safeToSpend, computeSafeToSpend } = useTaxProfileStore();
  const [balance, setBalance] = useState<string>("0");
  const [unpaidInvoices, setUnpaidInvoices] = useState<string>("0");

  useEffect(() => {
    (async () => {
      if (!user) return;

      const res = await fetchAllProjects(user.id);

      if (res.success) {
        if (res.data) {
          const totalProfit = res.data
            .reduce((acc, project) => acc + Number(project.totalProfit || 0), 0)
            .toFixed(2)
            .toString();
          setBalance(totalProfit);
        }
      } else {
        toast.error(res.error as string);
      }
    })();
  }, [user]);

  useEffect(() => {
    const currentBalance = Number(balance) || 0;
    const expectedIncomeNext30Days = Number(unpaidInvoices) || 0;

    computeSafeToSpend({
      currentBalance,
      expectedIncomeNext30Days,
    });
  }, [balance, unpaidInvoices, computeSafeToSpend]);

  useEffect(() => {
    (async () => {
      if (!user) return;

      const res = await calculateUnpaidInvoices(user.id);

      if (res.success) {
        if (res.data) {
          setUnpaidInvoices(res.data);
        }
      } else {
        toast.error(res.error as string);
      }
    })();
  }, [user]);

  return (
    <header className="grid grid-cols-1 md:grid-cols-5 gap-2 uppercase">
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Total Cash Balance:{" "}
          <span className="primary-green text-2xl font-bold"> ${balance}</span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Tax Reserved:{" "}
          <span className="primary-amber text-2xl font-bold">
            ${taxReserved}
          </span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full flex">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Safe to Spend:
          <span className="primary-cyan text-2xl font-bold">
            ${safeToSpend}
          </span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Unpaid Invoices:{" "}
          <span className="primary-amber text-2xl font-bold">
            ${unpaidInvoices}
          </span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Upcoming Bills:{" "}
          <span className="primary-red text-2xl font-bold">To be added...</span>
        </h1>
      </div>
    </header>
  );
}
