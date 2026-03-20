"use client";

import { fetchAllClients } from "@/actions/clients/fetchAllClients";
import { useClientStore } from "@/lib/store/useClientStore";
import { useAuth } from "@/lib/useAuth";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useFetchAllClients(enabled = true) {
  const { user } = useAuth();
  const { setClients } = useClientStore();

  useEffect(() => {
    if (!enabled) return;
    (async () => {
      if (!user) return;
      const res = await fetchAllClients(user.id);

      if (!res.success) {
        toast.error(res.error);
        return;
      }

      if (res.data) {
        setClients(res.data);
      }
    })();
  }, [enabled, setClients, user]);
}
