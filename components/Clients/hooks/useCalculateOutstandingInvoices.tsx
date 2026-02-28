"use client";

import { calculateOutstandingInvoices } from "@/actions/invoices/calculateOutstandingInvoices";
import { useClientStore } from "@/lib/store/useClientStore";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useCalculateOutstandingInvoices() {
  const { selectedClient, setOutstandingInvoices } = useClientStore();
  useEffect(() => {
    (async () => {
      console.log(
        "[OutstandingInvoices Effect] Triggered for clientId:",
        selectedClient?.id,
      );
      if (!selectedClient) {
        console.log(
          "[OutstandingInvoices Effect] No clientId found. Exiting effect.",
        );
        return;
      }

      console.log(
        "[OutstandingInvoices Effect] Calling calculateOutstandingInvoices with clientId:",
        selectedClient.id,
      );
      const res = await calculateOutstandingInvoices(selectedClient.id);

      console.log(
        "[OutstandingInvoices Effect] Received response from calculateOutstandingInvoices:",
        res,
      );

      if (res.success) {
        if (res.data) {
          console.log(
            "[OutstandingInvoices Effect] Setting outstandingInvoices with data:",
            res.data,
          );
          setOutstandingInvoices(res.data);
        } else {
          console.log(
            "[OutstandingInvoices Effect] No data returned in successful response.",
          );
        }
      } else {
        console.error("Error calculating outstanding invoices:", res.error);
        toast.error(res.error as string);
      }
    })();
  }, [selectedClient, setOutstandingInvoices]);
}
