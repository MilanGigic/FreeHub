export default function OutstandingInvoices() {
  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <div className="">
        <h1 className="text-base primary-slate uppercase font-semibold">
          Outstanding Invoices
        </h1>
        <p className="text-2xl font-bold primary-amber">$2,400</p>
        <p className="text-sm primary-slate">
          Outstanding invoices are invoices that are to be paid on or before the
          due date.
        </p>
      </div>
      <div className="border-b-2 background-border w-full"></div>
      <div>
        <h1 className="text-base primary-slate uppercase font-semibold">
          Overdue Invoices
        </h1>
        <p className="text-2xl font-bold primary-red">$3,200</p>
        <p className="text-sm primary-slate">
          Overdue invoices are invoices that are past the due date and are still
          outstanding.
        </p>
      </div>
    </div>
  );
}
