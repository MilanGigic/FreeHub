import {
  MUNICIPALITIES,
  MunicipalitySeed,
  pausalCards,
} from "@/config/constants";
import { useState } from "react";
import { useOnboardingStore } from "@/lib/store/useOnboardingStore";

export default function Hybrid() {
  const [query, setQuery] = useState("");

  const filtered = MUNICIPALITIES.filter((m: MunicipalitySeed) =>
    m.name.toLowerCase().includes(query.toLowerCase()),
  );

  const {
    model,
    setModel,
    sideWorkRegime,
    setSideWorkRegime,
    calcSideActivityTax,
    setCalcSideActivityTax,
    activityCode,
    setActivityCode,
    setMunicipality,
    haveMonthlyAmount,
    setHaveMonthlyAmount,
    payPersonalSalary,
    setPayPersonalSalary,
    trackingBusinessExpenses,
    setTrackingBusinessExpenses,
    setPersonalSalary,
    takeSalary,
    setTakeSalary,
    distributeDividends,
    setDistributeDividends,
  } = useOnboardingStore();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center">
        You have a regular job and also earn on the side. We will calculate tax
        only on your side income <br />
        (the part you are responsible for) and show you the combined picture for
        the annual surtax.
      </p>

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-xl font-semibold uppercase">
            What is your approximate monthly gross salary?
          </h1>
          <input
            type="number"
            placeholder="Enter your monthly gross salary"
            className="items-center w-full border px-4 py-2"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-xl font-semibold uppercase">
            How do you do the side work?
          </h1>
          <div className="flex flex-col items-center justify-center gap-2">
            <button
              onClick={() => setSideWorkRegime("freelancer")}
              className={`px-4 py-2 border ${sideWorkRegime === "freelancer" ? "bg-violet-200/45" : ""}`}
            >
              Unregistered freelancing (just invoice clients)
            </button>
            <button
              onClick={() => setSideWorkRegime("pausal")}
              className={`px-4 py-2 border ${sideWorkRegime === "pausal" ? "bg-violet-200/45" : ""}`}
            >
              Registered as preduzetnik – Paušal
            </button>
            <button
              onClick={() => setSideWorkRegime("knjigas")}
              className={`px-4 py-2 border ${sideWorkRegime === "knjigas" ? "bg-violet-200/45" : ""}`}
            >
              Registered as preduzetnik – Knjigaš
            </button>
            <button
              onClick={() => setSideWorkRegime("d.o.o.")}
              className={`px-4 py-2 border ${sideWorkRegime === "d.o.o." ? "bg-violet-200/45" : ""}`}
            >
              Through my own d.o.o.
            </button>
          </div>
        </div>

        {sideWorkRegime === "freelancer" ? (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-xl font-semibold uppercase">
              Do you prefer Model A or Model B?
            </h1>
            <div className="flex items-center gap-4 p-2">
              <button
                className={`py-2 px-4 border ${model === "Model A" ? "bg-purple-200/35" : ""}`}
                onClick={() => setModel("Model A")}
              >
                Model A
              </button>
              <button
                className={`py-2 px-4 border ${model === "Model B" ? "bg-purple-200/35" : ""}`}
                onClick={() => setModel("Model B")}
              >
                Model B
              </button>
            </div>
          </div>
        ) : sideWorkRegime === "pausal" ? (
          <div>
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-xl font-semibold uppercase">
                What is your activity code?
              </h1>
              <div className="flex items-center gap-4 p-2">
                {pausalCards.map((card, index) => (
                  <button
                    key={index}
                    className={`py-2 px-4 border ${card.title === activityCode ? "bg-orange-200/35" : ""}`}
                    onClick={() => setActivityCode(card.title)}
                  >
                    {card.title}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-xl font-semibold uppercase">
                In which municipality is your activity registered?
              </h1>
              <div className="w-full flex flex-col gap-2 relative">
                <input
                  placeholder="Počnite da kucate..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="text-center py-2 px-4 border"
                />

                {query && (
                  <div className="absolute top-full mt-1 w-full bg-(--background-elevated) border border-(--background-border) rounded-lg max-h-48 overflow-y-auto z-50">
                    {filtered.length > 0 ? (
                      filtered.map((m: MunicipalitySeed) => (
                        <div
                          key={m.code}
                          onClick={() => {
                            setMunicipality(m.code);
                            setQuery("");
                          }}
                          className="px-4 py-2 border background-border rounded-lg hover:border-(--accent-cyan) cursor-pointer bg-(--background-elevated)/60 hover:bg-(--accent-cyan)/60 backdrop-blur-xs text-primary"
                        >
                          {m.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Nema rezultata
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center w-full text-center gap-4 p-2">
              <h1 className="text-xl font-semibold uppercase">
                Do you have the official monthly amount from the Poreska uprava
                rešenje?
              </h1>
              <div className="flex items-center gap-4 p-2">
                <button
                  className={`py-2 px-4 border ${haveMonthlyAmount ? "bg-yellow-200/35" : ""}`}
                  onClick={() => setHaveMonthlyAmount(true)}
                >
                  Yes
                </button>
                <button
                  className={`py-2 px-4 border ${!haveMonthlyAmount ? "bg-yellow-200/35" : ""}`}
                  onClick={() => setHaveMonthlyAmount(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        ) : sideWorkRegime === "knjigas" ? (
          <div>
            <div className="flex flex-col items-center w-full text-center gap-4 p-2">
              <h1 className="text-xl font-semibold uppercase">
                Do you pay yourself a personal salary?
              </h1>
              <div className="flex items-center gap-4 p-2">
                <button
                  onClick={() => setPayPersonalSalary(true)}
                  className={`py-2 px-4 border ${payPersonalSalary ? "bg-yellow-200/35" : ""}`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setPayPersonalSalary(false)}
                  className={`py-2 px-4 border ${payPersonalSalary !== null && payPersonalSalary === false ? "bg-yellow-200/35" : ""}`}
                >
                  No
                </button>

                {payPersonalSalary && (
                  <input
                    type="number"
                    placeholder="How much gross per month..."
                    onChange={(e) => setPersonalSalary(Number(e.target.value))}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col items-center w-full text-center gap-4 p-2">
              <h1 className="text-xl font-semibold uppercase">
                Do you track business expenses?
              </h1>
              <div className="flex items-center gap-4 p-2">
                <button
                  onClick={() => setTrackingBusinessExpenses(true)}
                  className={`py-2 px-4 border ${trackingBusinessExpenses ? "bg-yellow-200/35" : ""}`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setTrackingBusinessExpenses(false)}
                  className={`py-2 px-4 border ${trackingBusinessExpenses !== null && trackingBusinessExpenses === false ? "bg-yellow-200/35" : ""}`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        ) : sideWorkRegime === "d.o.o." ? (
          <div>
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
          </div>
        ) : null}

        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-xl font-semibold uppercase text-center">
            Expected total annual income range (salary + side) – useful for
            surtax warning
          </h1>
          <input
            type="number"
            placeholder="Enter your expected annual income"
            className="items-center w-full border px-4 py-2"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-xl font-semibold uppercase text-center">
            Do you want us to calculate the side activity tax separately and
            show you the combined picture?
          </h1>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCalcSideActivityTax(true)}
              className={`px-4 py-2 border ${calcSideActivityTax === true ? "bg-slate-100/35" : ""}`}
            >
              Yes
            </button>
            <button
              onClick={() => setCalcSideActivityTax(false)}
              className={`px-4 py-2 border ${calcSideActivityTax === false ? "bg-slate-100/35" : ""}`}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
