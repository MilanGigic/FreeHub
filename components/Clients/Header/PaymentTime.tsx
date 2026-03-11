"use client";

import { useInvoiceStore } from "@/lib/store/useInvoiceStore";
import useCalculateAveragePaymentTime from "../hooks/(clients)/useCalculateAveragePaymentTime";

export default function PaymentTime() {
  const { averagePaymentTime } = useInvoiceStore();

  useCalculateAveragePaymentTime();

  return (
    <div className="background-elevated border background-border rounded-lg p-4">
      <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
        Average Payment Time
      </h1>
      <p className="text-2xl font-bold flex items-center gap-2 primary-cyan">
        {averagePaymentTime !== "0"
          ? averagePaymentTime + " days"
          : "No invoices paid"}
      </p>
    </div>
  );
}
