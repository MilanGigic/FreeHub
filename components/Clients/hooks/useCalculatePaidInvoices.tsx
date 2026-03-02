"use client";

import { calculatePaidInvoices } from "@/actions/invoices/calculatePaidInvoices";
import { useClientStore } from "@/lib/store/useClientStore";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useCalculatePaidInvoices() {
  const { selectedClient, setPaidInvoices } = useClientStore();

  useEffect(() => {
    (async () => {
      if (!selectedClient) return;
      const res = await calculatePaidInvoices(selectedClient.id);
      if (res.success) {
        if (res.data) {
          setPaidInvoices(res.data);
        }
      } else {
        console.error("Error calculating paid invoices:", res.error);
        toast.error(res.error as string);
      }
    })();
  }, [selectedClient, setPaidInvoices]);
}
