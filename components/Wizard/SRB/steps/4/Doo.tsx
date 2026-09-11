import { useWizardStore } from "@/lib/store/useWizardStore";

export default function Doo() {
  const {
    takeSalary,
    setTakeSalary,
    distributeDividends,
    setDistributeDividends,
    setStepFourDone,
  } = useWizardStore();
  return (
    <div className="flex flex-col items-center w-full text-center gap-4 p-2">
      <div className="flex flex-col items-center w-full text-center gap-4 p-2">
        <h1 className="text-xl font-semibold uppercase">
          Do you take a salary from the company?
        </h1>
        <div className="flex items-center gap-4 p-2">
          <button
            onClick={() => setTakeSalary(true)}
            className={`py-2 px-4 border ${takeSalary ? "bg-yellow-200/35" : ""}`}
          >
            Yes
          </button>
          <button
            onClick={() => setTakeSalary(false)}
            className={`py-2 px-4 border ${takeSalary !== null && takeSalary === false ? "bg-yellow-200/35" : ""}`}
          >
            No
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center w-full text-center gap-4 p-2">
        <h1 className="text-xl font-semibold uppercase">
          Do you plan to distribute dividends?
        </h1>
        <div className="flex items-center gap-4 p-2">
          <button
            onClick={() => setDistributeDividends(true)}
            className={`py-2 px-4 border ${distributeDividends ? "bg-yellow-200/35" : ""}`}
          >
            Yes
          </button>
          <button
            onClick={() => setDistributeDividends(false)}
            className={`py-2 px-4 border ${distributeDividends !== null && distributeDividends === false ? "bg-yellow-200/35" : ""}`}
          >
            No
          </button>
        </div>
      </div>
      {takeSalary !== null && distributeDividends !== null ? (
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
