"use client";

import { calculateTotalRevenue } from "@/actions/clients/calculateTotalRevenue";
import { fetchAllClients } from "@/actions/clients/fetchAllClients";
import { useClientStore } from "@/lib/store/useClientStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ClientsHeader() {
  const { clients, setClients } = useClientStore();
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const res = await fetchAllClients();

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      if (res.data) {
        setClients(res.data);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await calculateTotalRevenue();

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      if (res.data) {
        setTotalRevenue(res.data);
      }
    })();
  }, []);

  return (
    <div className="grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-3">
      <div className="background-elevated border background-border rounded-lg p-4">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Total Active Clients
        </h1>
        <p className="text-2xl font-bold flex items-center gap-2">
          {clients.length}
        </p>
      </div>

      <div className="background-elevated border background-border rounded-lg p-4">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Revenue This Month
        </h1>
        <p className="text-2xl font-bold flex items-center gap-2">
          ${totalRevenue}
        </p>
      </div>

      <div className="background-elevated border background-border rounded-lg p-4">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Outstanding Invoices
        </h1>
        <p className="text-2xl font-bold flex items-center gap-2">
          To be added...
        </p>
      </div>

      <div className="background-elevated border background-border rounded-lg p-4">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Average Payment Time
        </h1>
        <p className="text-2xl font-bold flex items-center gap-2">
          To be added...
        </p>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Top Client % of Revenue
        </h1>
        <p className="text-2xl font-bold flex items-center gap-2">
          To be added...
        </p>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Revenue Concentration Warning
        </h1>
        <p className="text-2xl font-bold flex items-center gap-2">
          To be added...
        </p>
      </div>
    </div>
  );
}
