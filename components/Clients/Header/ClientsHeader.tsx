"use client";

import ActiveClients from "./ActiveClients";
import RevenueThisMonth from "./RevenueThisMonth";
import OutstandingInvoices from "./OutstandingInvoices";
import PaymentTime from "./PaymentTime";
import ExpensesThisMonth from "./ExpensesThisMonth";
import RevenueConcentration from "./RevenueConcentration";

export default function ClientsHeader() {
  return (
    <div className="grid gap-2 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <ActiveClients />
      <RevenueThisMonth />
      <OutstandingInvoices />

      <PaymentTime />
      <ExpensesThisMonth />
      <RevenueConcentration />
    </div>
  );
}
