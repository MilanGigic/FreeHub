"use client";

import { useClientStore } from "@/lib/store/useClientStore";
import useFetchAllClients from "../hooks/(clients)/useFetchAllClients";

export default function ActiveClients() {
  const { clients } = useClientStore();

  useFetchAllClients();
  return (
    <div className="background-elevated border background-border rounded-lg p-4">
      <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
        Total Active Clients
      </h1>
      <p className="text-2xl font-bold flex items-center gap-2 primary-purple">
        {clients.length}
      </p>
    </div>
  );
}
