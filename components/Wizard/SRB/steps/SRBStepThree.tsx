"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { useWizardStore } from "@/lib/store/useWizardStore";
import { MouseEvent, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { MunicipalitySelect } from "@/components/MunicipalitySelect";

export default function SRBStepThree() {
  const { regime } = useWizardStore();
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "1");
  const router = useRouter();
  const t = useTranslations("wizard");
  const [activeMonths, setActiveMonths] = useState<number | null>(null);
  const [grossAnnualIncome, setGrossAnnualIncome] = useState<number>(0);
  const [isLessThan40, setIsLessThan40] = useState<boolean>(false);
  const [municipality, setMunicipality] = useState<string>("");
  const [averageAnnualSalary, setAverageAnnualSalary] = useState<number>(0);
  const [personalSalary, setPersonalSalary] = useState<number>(0);
  const debouncedGrossAnnualIncome = useDebounce(grossAnnualIncome, 500);
  const [isPayingPersonalSalary, setIsPayingPersonalSalary] =
    useState<boolean>(false);
  const [numberOfClients, setNumberOfClients] = useState<number>(0);

  const handleProceed = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let res;

    // if (regime === "frilenser") {
    //   res = await updateStepTwo({
    //     model: selected.value,
    //     healthInsuredElsewhere: false,
    //   });
    // } else if (regime === "pausal") {
    //   res = await updateStepTwo({
    //     pausalActivityCode: selected.value,
    //   });
    // } else if (regime === "knjigas") {
    //   res = await updateStepTwo({
    //     businessModel: selected.value,
    //   });
    // }

    // if (res?.success) {
    //   router.push("/sr-Latn/onboarding?step=3");
    // } else {
    //   toast.error(res?.error || "Greška");
    // }
  };

  const heading =
    regime === "frilenser"
      ? "Još malo da završimo podešavanje naloga..."
      : regime === "pausal"
        ? "Potrebne su nam još neke informacije..."
        : "Potrebno nam je još par brojeva...";

  return (
    <div className="w-full h-full flex flex-col text-primary justify-between">
      <h1 className="text-primary text-2xl font-semibold w-full text-center uppercase tracking-wider">
        {heading}
      </h1>
      <div>
        {regime === "frilenser" ? (
          <div className="w-full flex flex-col gap-4 items-center h-full">
            {/* Question 1 — Months worked */}
            <div className="w-full max-w-md bg-(--background-elevated) border border-(--background-border) rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                  01
                </span>
                <h1 className="text-primary text-lg font-semibold">
                  Koliko meseci ste radili?
                </h1>
              </div>
              <Select
                value={activeMonths ? String(activeMonths) : "1"}
                onValueChange={(value) => setActiveMonths(Number(value))}
              >
                <SelectTrigger className="w-full text-primary text-base font-medium border border-(--background-border) rounded-xl bg-transparent px-4 py-3">
                  <SelectValue
                    placeholder="Izaberite broj meseci"
                    className="text-primary"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.from({ length: 12 }, (_, index) => (
                      <SelectItem key={index} value={String(index + 1)}>
                        {index + 1}{" "}
                        {index + 1 === 1
                          ? "mesec"
                          : index + 1 < 5
                            ? "meseca"
                            : "meseci"}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Question 2 — Quarterly income */}
            <div className="w-full max-w-md bg-(--background-elevated) border border-(--background-border) rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                  02
                </span>
                <FieldLabel className="text-primary text-lg font-semibold">
                  Iznos iz poslednjeg kvartala
                </FieldLabel>
              </div>
              <div className="w-full">
                <Input
                  type="string"
                  placeholder="0.00"
                  className="w-full pl-14 text-left text-base bg-transparent border border-(--background-border) rounded-xl p-3 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan) transition-colors"
                  onChange={(e) => setGrossAnnualIncome(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Question 3 — Age check */}
            <div className="w-full max-w-md bg-(--background-elevated) border border-(--background-border) rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                  03
                </span>
                <FieldLabel className="text-primary text-lg font-semibold">
                  Da li imate manje od 40 godina?
                </FieldLabel>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsLessThan40(true)}
                  className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-all duration-200
              ${
                isLessThan40
                  ? "bg-(--accent-cyan)/20 border-(--accent-cyan) text-(--accent-cyan)"
                  : "bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
              }`}
                >
                  Da
                </button>
                <button
                  onClick={() => setIsLessThan40(false)}
                  className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-all duration-200
              ${
                !isLessThan40
                  ? "bg-(--accent-red)/20 border-(--accent-red) text-(--accent-red)"
                  : "bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
              }`}
                >
                  Ne
                </button>
              </div>
            </div>
          </div>
        ) : regime === "pausal" ? (
          <div className="w-full flex flex-col gap-4 items-center h-full">
            <div className="w-full max-w-md bg-(--background-elevated) p-6 flex flex-col gap-3">
              <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
                <div className="flex items-center gap-3 mb-1 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                    01
                  </span>
                  <h1 className="text-primary text-lg font-semibold">
                    Izaberite opštinu: {municipality}
                  </h1>
                </div>
                <MunicipalitySelect
                  value={municipality}
                  onChange={setMunicipality}
                />
              </div>

              <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
                <div className="flex items-center gap-3 mb-1 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                    02
                  </span>
                  <h1 className="text-primary text-lg font-semibold">
                    Broj zaposlenih
                  </h1>
                </div>
                <Field orientation="horizontal">
                  <FieldContent>
                    <Input
                      type="string"
                      placeholder="Broj zaposlenih"
                      className="w-full text-center text-lg bg-transparent border background-border rounded p-2 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
                    />
                  </FieldContent>
                </Field>
              </div>
              <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
                <div className="flex items-center gap-3 mb-1 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                    03
                  </span>
                  <h1 className="text-primary text-lg font-semibold text-center">
                    Procenjeni godišnji prihod
                  </h1>
                </div>
                <Field orientation="horizontal">
                  <FieldContent>
                    <Input
                      type="string"
                      placeholder="Iznos"
                      className="w-full text-center text-lg bg-transparent border background-border rounded p-2 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
                      onChange={(e) =>
                        setAverageAnnualSalary(Number(e.target.value))
                      }
                    />
                  </FieldContent>
                </Field>
              </div>
              <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
                <div className="flex items-center gap-3 mb-1 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                    04
                  </span>
                  <h1 className="text-primary text-lg font-semibold text-center flex flex-col gap-1">
                    Sa koliko klijenata poslujete?{" "}
                    <span className="text-xs primary-slate font-semibold">
                      (pitamo zbog testa nezavisnosti / možete preskočiti)
                    </span>
                  </h1>
                </div>
                <Field orientation="horizontal">
                  <FieldContent>
                    <Input
                      type="string"
                      placeholder="Broj klijenata"
                      className="w-full text-center text-lg bg-transparent border background-border rounded p-2 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
                      onChange={(e) =>
                        setNumberOfClients(Number(e.target.value))
                      }
                    />
                  </FieldContent>
                </Field>
              </div>
              <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                    05
                  </span>
                  <FieldLabel className="text-primary text-lg font-semibold">
                    Da li imate manje od 40 godina?
                  </FieldLabel>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setIsLessThan40(true)}
                    className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-all duration-200
              ${
                isLessThan40
                  ? "bg-(--accent-cyan)/20 border-(--accent-cyan) text-(--accent-cyan)"
                  : "bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
              }`}
                  >
                    Da
                  </button>
                  <button
                    onClick={() => setIsLessThan40(false)}
                    className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-all duration-200
              ${
                !isLessThan40
                  ? "bg-(--accent-red)/20 border-(--accent-red) text-(--accent-red)"
                  : "bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
              }`}
                  >
                    Ne
                  </button>
                </div>
              </div>
              <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                    06
                  </span>
                  <h1 className="text-primary text-lg font-semibold">
                    Koliko meseci ste radili?
                  </h1>
                </div>
                <Select
                  value={activeMonths ? String(activeMonths) : "1"}
                  onValueChange={(value) => setActiveMonths(Number(value))}
                >
                  <SelectTrigger className="w-full text-primary text-base font-medium border border-(--background-border) rounded-xl bg-transparent px-4 py-3">
                    <SelectValue
                      placeholder="Izaberite broj meseci"
                      className="text-primary"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Array.from({ length: 12 }, (_, index) => (
                        <SelectItem key={index} value={String(index + 1)}>
                          {index + 1}{" "}
                          {index + 1 === 1
                            ? "mesec"
                            : index + 1 < 5
                              ? "meseca"
                              : "meseci"}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : regime === "knjigas" ? (
          <div className="w-full flex flex-col gap-4 items-center h-full">
            <div className="w-full max-w-md bg-(--background-elevated) p-6 flex flex-col gap-3">
              <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                    01
                  </span>
                  <h1 className="text-primary text-lg font-semibold">
                    Da li isplaćujete ličnu zaradu?
                  </h1>
                </div>

                <div className="flex flex-col gap-4 w-full">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsPayingPersonalSalary(true)}
                      className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-all duration-200
                    ${
                      isPayingPersonalSalary
                        ? "bg-(--accent-cyan)/20 border-(--accent-cyan) text-(--accent-cyan)"
                        : "bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
                    }`}
                    >
                      Da
                    </button>
                    <button
                      onClick={() => setIsPayingPersonalSalary(false)}
                      className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-all duration-200
              ${
                !isPayingPersonalSalary
                  ? "bg-(--accent-red)/20 border-(--accent-red) text-(--accent-red)"
                  : "bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
              }`}
                    >
                      Ne
                    </button>
                  </div>
                  {isPayingPersonalSalary && (
                    <Input
                      placeholder="Iznos"
                      className="w-full text-center text-lg bg-transparent border background-border rounded p-2 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
                      onChange={(e) =>
                        setPersonalSalary(Number(e.target.value))
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
                <div className="flex items-center gap-3 mb-1 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                    02
                  </span>
                  <h1 className="text-primary text-lg font-semibold text-center">
                    Procenjeni godišnji prihod
                  </h1>
                </div>
                <Field orientation="horizontal">
                  <FieldContent>
                    <Input
                      type="string"
                      placeholder="Iznos"
                      className="w-full text-center text-lg bg-transparent border background-border rounded p-2 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
                      onChange={(e) =>
                        setAverageAnnualSalary(Number(e.target.value))
                      }
                    />
                  </FieldContent>
                </Field>
              </div>
              <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
                <div className="flex items-center gap-3 mb-1 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                    03
                  </span>
                  <h1 className="text-primary text-lg font-semibold text-center flex flex-col gap-1">
                    Sa koliko klijenata poslujete?{" "}
                    <span className="text-xs primary-slate font-semibold">
                      (pitamo zbog testa nezavisnosti / možete preskočiti)
                    </span>
                  </h1>
                </div>
                <Field orientation="horizontal">
                  <FieldContent>
                    <Input
                      type="string"
                      placeholder="Broj klijenata"
                      className="w-full text-center text-lg bg-transparent border background-border rounded p-2 text-primary placeholder-gray-600 outline-none focus:border-(--accent-cyan)"
                      onChange={(e) =>
                        setNumberOfClients(Number(e.target.value))
                      }
                    />
                  </FieldContent>
                </Field>
              </div>
              <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                    04
                  </span>
                  <FieldLabel className="text-primary text-lg font-semibold">
                    Da li imate manje od 40 godina?
                  </FieldLabel>
                </div>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setIsLessThan40(true)}
                    className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-all duration-200
              ${
                isLessThan40
                  ? "bg-(--accent-cyan)/20 border-(--accent-cyan) text-(--accent-cyan)"
                  : "bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
              }`}
                  >
                    Da
                  </button>
                  <button
                    onClick={() => setIsLessThan40(false)}
                    className={`flex-1 py-3 rounded-xl border font-semibold text-base transition-all duration-200
              ${
                !isLessThan40
                  ? "bg-(--accent-red)/20 border-(--accent-red) text-(--accent-red)"
                  : "bg-transparent border-(--background-border) text-primary opacity-50 hover:opacity-80"
              }`}
                  >
                    Ne
                  </button>
                </div>
              </div>
              <div className="flex flex-col border background-border rounded-lg p-4 gap-2 background-elevated">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-(--accent-cyan) opacity-70">
                    05
                  </span>
                  <h1 className="text-primary text-lg font-semibold">
                    Koliko meseci ste radili?
                  </h1>
                </div>
                <Select
                  value={activeMonths ? String(activeMonths) : "1"}
                  onValueChange={(value) => setActiveMonths(Number(value))}
                >
                  <SelectTrigger className="w-full text-primary text-base font-medium border border-(--background-border) rounded-xl bg-transparent px-4 py-3">
                    <SelectValue
                      placeholder="Izaberite broj meseci"
                      className="text-primary"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Array.from({ length: 12 }, (_, index) => (
                        <SelectItem key={index} value={String(index + 1)}>
                          {index + 1}{" "}
                          {index + 1 === 1
                            ? "mesec"
                            : index + 1 < 5
                              ? "meseca"
                              : "meseci"}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 max-w-md w-full mx-auto mb-12">
        <button
          onClick={handleProceed}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
        >
          {t("proceed")} <ArrowRightIcon size={20} />
        </button>

        <button
          onClick={() => router.replace("/sr-Latn/onboarding")}
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          {t("skip")}
        </button>
        <button
          onClick={() =>
            router.push(`/sr-Latn/onboarding?step=${currentStep - 1}`)
          }
          className="primary-cyan py-2 px-4 text-lg font-bold uppercase border background-border rounded-lg w-full background-elevated hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon size={20} /> {t("back")}
        </button>
      </div>
    </div>
  );
}

// TODO: Refactor this component
// >>>>> Add updateStepThree.ts action
