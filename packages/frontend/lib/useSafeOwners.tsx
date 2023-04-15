import { useEffect, useState } from "react";
import { getSafeTransactionService } from "./constants";

export const useSafeOwners = (
  chainId: number | null | undefined,
  safeAddress: string | null | undefined
): { owners: string[] | null; isLoading: boolean } => {
  const [owners, setOwners] = useState<string[] | null>(null);
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
        setOwners(body.owners);
      } catch (e) {
        setOwners(null);
      }
      setIsLoading(false);
    };
    fetchOwners();
  }, [safeAddress]);

  return { owners, isLoading };
};
