"use client";

import { fetchClient } from "@/actions/clients/fetchClient";
import { useClientStore } from "@/lib/store/useClientStore";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function useFetchClient(
  setIsLoading: (isLoading: boolean) => void,
) {
  const { setSelectedClient, selectedClient } = useClientStore();
  useEffect(() => {
    if (!selectedClient) return;
    (async () => {
      setIsLoading(true);
      const res = await fetchClient(selectedClient.id);
      if (res.success) {
        if (res.data) {
          setSelectedClient(res.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          toast.error(res.error as string);
        }
      } else {
        setIsLoading(false);
        toast.error(res.error as string);
      }
    })();
  }, [selectedClient, setSelectedClient, setIsLoading]);
}
