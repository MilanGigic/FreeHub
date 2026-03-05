"use client";

import { fetchPaidInvoices } from "@/actions/invoices/fetchPaidInvoices";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useAuth } from "@/lib/useAuth";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useFetchInvoices() {
  const { user } = useAuth();
  const { selectedProject, setPaidInvoices } = useProjectStore();

  useEffect(() => {
    (async () => {
      if (!selectedProject || !user) {
        console.warn("[useFetchInvoices] Missing required value(s)", {
          selectedProject,
          user,
        });
        return;
      }

      const res = await fetchPaidInvoices(user.id, selectedProject.id);

      if (res.success) {
        if (res.data) {
          setPaidInvoices(res.data);
        }
      } else {
        console.error("[useFetchInvoices] Error:", res.error);
        toast.error(res.error as string);
      }
    })();
  }, [selectedProject, user, setPaidInvoices]);
}
