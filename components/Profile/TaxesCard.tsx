import { useTranslations } from "next-intl";
// import { useActionState } from "react";

// const initialState: ProfileState = { status: "idle" };

export default function TaxesCard() {
  const t = useTranslations("profile");
  // const [state, formAction, pending] = useActionState(
  //   updateProfile,
  //   initialState,
  // );
  // const errors = state.status === "error" ? state.fieldErrors : undefined;

  return (
    <div className="w-full flex justify-between border-b background-border pb-8 gap-8">
      <div className="w-[40%] flex flex-col gap-2">
        <h1 className="text-[#EAEAEA]">{t("taxes")}</h1>
        <p className="text-gray-400 text-sm tracking-wide">{t("taxesDesc")}</p>
      </div>
      <form className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <label htmlFor="regime" className="text-slate-400 text-sm">
            {t("taxRegime")}
          </label>
          <select
            name="regime"
            id="regime"
            className="w-full px-4 py-2 border background-border rounded-lg outline-none focus:border-[#EAEAEA] transition-all duration-300 text-primary background-elevated text-xl font-light"
          >
            <option
              className="text-xl font-medium rounded-md"
              value="Freelancer - Model A"
            >
              Freelancer - Model A
            </option>
            <option
              className="text-xl font-medium rounded-md"
              value="Freelancer - Model B"
            >
              Freelancer - Model B
            </option>
            <option className="text-xl font-medium rounded-md" value="Pausal">
              Pausal
            </option>
            <option className="text-xl font-medium rounded-md" value="Knjigas">
              Knjigas
            </option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="credibleFrom" className="text-slate-400 text-sm">
            {t("credibleFrom")}
          </label>

          <input
            type="date"
            name="credibleFrom"
            className="text-[#EAEAEA] border px-4 py-2 rounded-md background-elevated background-border outline-none focus:border-[#EAEAEA] transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="taxReservePercentage"
            className="text-slate-400 text-sm"
          >
            {t("taxReservePercentage")}
          </label>
          <input
            type="text"
            name="taxReservePrecentage"
            className="text-[#EAEAEA] border px-4 py-2 rounded-md background-elevated background-border outline-none focus:border-[#EAEAEA] transition"
            disabled
            value="10%"
          />
        </div>

        <p className="primary-amber text-xs">{t("regimeChangeDesc")}</p>

        <div>
          <button
            className="font-medium tracking-wide border rounded-md bg-[#EAEAEA] px-4 py-2 cursor-pointer hover:opacity-90 transition"
            type="submit"
            // disabled={pending}
          >
            {/* {pending ? t("saving") : t("save")} */}
            {t("save")}
          </button>
        </div>
        {/* {state.status === "success" && (
          <p className="primary-green text-center p-4" role="status">
            {t("saved")}
          </p>
        )}
        {state.status === "error" && state.message && (
          <p className="primary-red text-center p-4" role="alert">
            {t(state.message)}
          </p>
        )} */}
      </form>
    </div>
  );
}
