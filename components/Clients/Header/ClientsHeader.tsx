"use client";

import { useClientStore } from "@/lib/store/useClientStore";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { toast } from "react-toastify";
import { fetchClientsPageMetrics } from "@/actions/clients/fetchClientsPageMetrics";

export default function ClientsHeader() {
  const { clients } = useClientStore();
  const { user } = useAuth();
  const [revenueThisMonth, setRevenueThisMonth] = useState("0.00");
  const [expensesThisMonth, setExpensesThisMonth] = useState("0.00");
  const [outstandingInvoices, setOutstandingInvoices] = useState("0.00");

  useEffect(() => {
    (async () => {
      if (!user) return;
      const res = await fetchClientsPageMetrics(user.id);
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      if (!res.data) return;
      setRevenueThisMonth(res.data.revenueThisMonth);
      setExpensesThisMonth(res.data.expensesThisMonth);
      setOutstandingInvoices(res.data.outstandingInvoices);
    })();
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-purple text-5xl font-bold tracking-widest mb-6">
          {clients.length}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          Total Active Clients
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-green text-5xl font-bold tracking-widest mb-6">
          ${revenueThisMonth}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          Revenue This Month
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-red text-5xl font-bold tracking-widest mb-6">
          ${expensesThisMonth}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          Expenses This Month
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        <p className="primary-amber text-5xl font-bold tracking-widest mb-6 flex flex-col items-center">
          ${outstandingInvoices}
        </p>
        <p className="text-primary text-base uppercase tracking-widest mb-6">
          Outstanding Invoices
        </p>
      </div>
    </div>
  );
}
