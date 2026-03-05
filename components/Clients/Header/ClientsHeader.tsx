"use client";

import ActiveClients from "./ActiveClients";
import RevenueThisMonth from "./RevenueThisMonth";
import OutstandingInvoices from "./OutstandingInvoices";
import PaymentTime from "./PaymentTime";

export default function ClientsHeader() {
  return (
    <div className="grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-3">
      <ActiveClients />

      <RevenueThisMonth />
      <OutstandingInvoices />

      <PaymentTime />
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
