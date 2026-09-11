import { useWizardStore } from "@/lib/store/useWizardStore";

export default function Employee() {
  const {
    onlySalary,
    setOnlySalary,
    monthlyGrossSalary,
    setMonthlyGrossSalary,
    trackNetPay,
    setTrackNetPay,
    setStepFourDone,
  } = useWizardStore();
  return (
    <div
      className={`flex flex-col items-center gap-4 w-full ${onlySalary !== null && monthlyGrossSalary !== null && trackNetPay !== null ? "border-b-2" : ""}`}
    >
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold uppercase">
          Do you receive only salary, or do you also have other income?
        </h1>
        <div className="flex items-center gap-4 p-2">
          <button
            className={`py-2 px-4 border ${onlySalary ? "bg-purple-200/35" : ""}`}
            onClick={() => setOnlySalary(true)}
          >
            Only salary
          </button>
          <button
            className={`py-2 px-4 border ${onlySalary === false ? "bg-purple-200/35" : ""}`}
            onClick={() => setOnlySalary(false)}
          >
            Salary + other income (rental, dividends, capital gains, freelance
            side work, etc.)
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center w-full text-center gap-4 p-2">
        <h1 className="text-xl font-semibold uppercase">
          Rough monthly gross salary <br />{" "}
          <span className="text-slate-400">
            (optional – useful for projections and “safe to spend”)
          </span>
        </h1>
        <input
          type="number"
          placeholder="Enter your monthly gross salary"
          className="border py-2 px-4 w-full text-center"
          onChange={(e) => setMonthlyGrossSalary(Number(e.target.value))}
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold uppercase">
          Do you want us to track your net pay and employer cost for cash-flow
          purposes?
        </h1>
        <div className="flex items-center gap-4 p-2">
          <button
            className={`py-2 px-4 border ${trackNetPay ? "bg-purple-200/35" : ""}`}
            onClick={() => setTrackNetPay(true)}
          >
            Yes
          </button>
          <button
            className={`py-2 px-4 border ${trackNetPay === false ? "bg-purple-200/35" : ""}`}
            onClick={() => setTrackNetPay(false)}
          >
            No
          </button>
        </div>
      </div>
      {onlySalary !== null &&
      monthlyGrossSalary !== null &&
      trackNetPay !== null ? (
        <button
          onClick={() => setStepFourDone(true)}
          className="text-xl font-bold border px-4 py-2 cursor-pointer"
        >
          Go Next
        </button>
      ) : null}
    </div>
  );
}
