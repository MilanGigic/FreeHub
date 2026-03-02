export default function FinanceHeader() {
  return (
    <header className="grid grid-cols-1 md:grid-cols-5 gap-2 uppercase">
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Total Cash Balance:{" "}
          <span className="primary-green text-2xl font-bold"> $6,400</span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Tax Reserved:{" "}
          <span className="primary-amber text-2xl font-bold"> $1,340</span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full flex">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Safe to Spend:
          <span className="primary-cyan text-2xl font-bold">$1,200</span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Unpaid Invoices:{" "}
          <span className="primary-red text-2xl font-bold"> $2,500</span>
        </h1>
      </div>
      <div className="background-elevated border background-border rounded-lg p-4 w-full">
        <h1 className="text-base font-semibold flex flex-col justify-center primary-slate">
          Upcoming Bills:{" "}
          <span className="primary-red text-2xl font-bold"> $1,200</span>
        </h1>
      </div>
    </header>
  );
}
