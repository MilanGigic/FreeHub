"use client";

import { useClientStore } from "@/lib/store/useClientStore";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { toast } from "react-toastify";
import { fetchClientsPageMetrics } from "@/actions/clients/fetchClientsPageMetrics";
import { Loader2 } from "lucide-react";

export default function ClientsHeader() {
  const { clients } = useClientStore();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [revenueThisMonth, setRevenueThisMonth] = useState("0.00");
  const [expensesThisMonth, setExpensesThisMonth] = useState("0.00");
  const [outstandingInvoices, setOutstandingInvoices] = useState("0.00");

  useEffect(() => {
    (async () => {
      if (!user) return;
      setIsLoading(true);
      const res = await fetchClientsPageMetrics(user.id);
      if (!res.success) {
        toast.error(res.error);
        setIsLoading(false);
        return;
      }
      if (!res.data) {
        setIsLoading(false);
        return;
      }
      setRevenueThisMonth(res.data.revenueThisMonth);
      setExpensesThisMonth(res.data.expensesThisMonth);
      setOutstandingInvoices(res.data.outstandingInvoices);
      setIsLoading(false);
    })();
  }, [user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="text-primary text-sm font-semibold tracking-wider uppercase">
              Loading Total Active Clients...
            </p>
            <Loader2 className="w-8 h-8 animate-spin primary-cyan mt-2" />
          </div>
        ) : (
          <>
            <p className="primary-purple text-5xl font-bold tracking-widest mb-6">
              {clients.length}
            </p>
            <p className="text-primary text-base uppercase tracking-widest mb-6">
              Total Active Clients
            </p>
          </>
        )}
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="text-primary text-sm font-semibold tracking-wider uppercase">
              Loading Revenue This Month...
            </p>
            <Loader2 className="w-8 h-8 animate-spin primary-cyan mt-2" />
          </div>
        ) : (
          <>
            <p className="primary-green text-5xl font-bold tracking-widest mb-6">
              ${revenueThisMonth}
            </p>
            <p className="text-primary text-base uppercase tracking-widest mb-6">
              Revenue This Month
            </p>
          </>
        )}
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="text-primary text-sm font-semibold tracking-wider uppercase">
              Loading Expenses This Month...
            </p>
            <Loader2 className="w-8 h-8 animate-spin primary-cyan mt-2" />
          </div>
        ) : (
          <>
            <p className="primary-red text-5xl font-bold tracking-widest mb-6">
              ${expensesThisMonth}
            </p>
            <p className="text-primary text-base uppercase tracking-widest mb-6">
              Expenses This Month
            </p>
          </>
        )}
      </div>
      <div className="background-elevated border background-border flex flex-col items-center rounded-2xl p-4 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <p className="text-primary text-sm font-semibold tracking-wider uppercase">
              Loading Outstanding Invoices...
            </p>
            <Loader2 className="w-8 h-8 animate-spin primary-cyan mt-2" />
          </div>
        ) : (
          <>
            <p className="primary-amber text-5xl font-bold tracking-widest mb-6 flex flex-col items-center">
              ${outstandingInvoices}
            </p>
            <p className="text-primary text-base uppercase tracking-widest mb-6">
              Outstanding Invoices
            </p>
          </>
        )}
      </div>
    </div>
  );
}
