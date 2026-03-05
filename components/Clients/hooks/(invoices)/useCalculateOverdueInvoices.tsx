"use client";

import { calculateOverdueInvoices } from "@/actions/invoices/calculateOverdueInvoice";
import { useClientStore } from "@/lib/store/useClientStore";
import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useCalculateOverdueInvoices() {
  const { selectedClient } = useClientStore();
  const { setOverdueInvoices } = useInvoiceStore();

  useEffect(() => {
    (async () => {
      if (!selectedClient) return;

      const res = await calculateOverdueInvoices(selectedClient.id);

      if (res.success) {
        if (res.data) {
          setOverdueInvoices({ data: res.data, count: res.count });
        }
      } else {
        console.error("Error calculating overdue invoices:", res.error);
        toast.error(res.error as string);
      }
    })();
  }, [selectedClient, setOverdueInvoices]);
}
