import InvoicesTable from "@/components/Clients/ClientPage/Invoices/InvoicesTable";

export default function InvoicesPage() {
  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4">
      <header className="flex gap-2 md:gap-4 justify-center">
        <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
          <h1 className="text-base text-secondary uppercase font-semibold">
            Outstanding Invoices
          </h1>
          <p className="text-2xl font-bold primary-amber">$1,200</p>
        </div>
        <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
          <h1 className="text-base text-secondary uppercase font-semibold">
            Overdue Invoices
          </h1>
          <p className="text-2xl font-bold primary-red">$600</p>
        </div>
        <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
          <h1 className="text-base text-secondary uppercase font-semibold">
            Average Days to Pay
          </h1>
          <p className="text-2xl font-bold primary-cyan">7 days</p>
        </div>
      </header>
      <InvoicesTable />
    </div>
  );
}
