import { completeOnboardingAction } from "@/actions/taxProfile/completeOnboardingAction";
import { useWizardStore } from "@/lib/store/useWizardStore";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function SRBStepSix() {
  const tOnboarding = useTranslations("onboarding.stepSix");
  const tCommon = useTranslations("onboarding.common");

  const router = useRouter();

  const {
    mainClients,
    setMainClients,
    otherSignificantIncome,
    setOtherSignificantIncome,
    setFinishOnboarding,
  } = useWizardStore();

  const finish = async () => {
    const data = useWizardStore.getState();

    const result = await completeOnboardingAction(data);

    if (result.success) {
      // Clear the onboarding store
      useWizardStore.persist.clearStorage(); // or reset all fields

      // Redirect to dashboard / finances
      router.push("/sr-Latn/dashboard");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center text-primary gap-6 justify-between">
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="flex flex-col items-center w-full text-center gap-4 p-2">
          <h1 className="text-xl font-semibold uppercase">
            {tOnboarding("mainClientsTitle")}
          </h1>
          <div className="flex items-center gap-4">
            <button
              className={`py-2 px-4 border ${mainClients === "domestic" ? "bg-cyan-200/35" : ""}`}
              onClick={() => setMainClients("domestic")}
            >
              {tOnboarding("domestic")}
            </button>
            <button
              className={`py-2 px-4 border ${mainClients === "foreign" ? "bg-cyan-200/35" : ""}`}
              onClick={() => setMainClients("foreign")}
            >
              {tOnboarding("foreign")}
            </button>
            <button
              className={`py-2 px-4 border ${mainClients === "mixed" ? "bg-cyan-200/35" : ""}`}
              onClick={() => setMainClients("mixed")}
            >
              {tOnboarding("mixed")}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center w-full text-center gap-4 p-2">
          <h1 className="text-xl font-semibold uppercase">
            {tOnboarding("otherIncomeTitle")}
          </h1>

          <div className="flex items-center gap-4">
            <button
              className={`py-2 px-4 border ${otherSignificantIncome === true ? "bg-cyan-200/35" : ""}`}
              onClick={() => setOtherSignificantIncome(true)}
            >
              {tCommon("yes")}
            </button>
            <button
              className={`py-2 px-4 border ${otherSignificantIncome === false ? "bg-cyan-200/35" : ""}`}
              onClick={() => setOtherSignificantIncome(false)}
            >
              {tCommon("no")}
            </button>
          </div>
        </div>
      </div>
      {mainClients !== null && otherSignificantIncome !== null ? (
        <button
          onClick={() => {
            setFinishOnboarding(true);
            finish();
          }}
          className="text-xl font-bold border px-4 py-2 cursor-pointer"
        >
          {tCommon("finish")}
        </button>
      ) : null}
    </div>
  );
}
