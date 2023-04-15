import { useEffect, useState } from "react";
import { getSafeTransactionService } from "./constants";

export const useSafeModules = (
  chainId: number | null | undefined,
  safeAddress: string | null | undefined
): { modules: string[] | null; isLoading: boolean } => {
  const [modules, setModules] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!safeAddress || !chainId) return;
    const fetchOwners = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${getSafeTransactionService(chainId)}/api/v1/safes/${safeAddress}`
        );
        const body = await response.json();
        setModules(body.modules);
      } catch (e) {
        setModules(null);
      }
      setIsLoading(false);
    };
    fetchOwners();
  }, [safeAddress]);

  return { modules, isLoading };
};