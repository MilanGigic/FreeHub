import { PausalResolutionSource } from "@/lib/pausalResolver";
import { TaxResult, useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { useEffect } from "react";

type Props = {
  taxResult: TaxResult;
  taxMeta: {
    isComputable: boolean;
    pausalSource?: PausalResolutionSource;
  };
};

export function TaxStoreHydrator({ taxResult, taxMeta }: Props) {
  useEffect(() => {
    useTaxProfileStore.setState({ taxResult, taxMeta });
  }, [taxResult, taxMeta]);

  return null;
}
