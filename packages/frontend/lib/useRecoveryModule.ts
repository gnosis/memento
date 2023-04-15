import { useEffect, useState } from "react";
import { getJsonRpcProvider } from "./constants";
import { Contract } from "ethers";
import { recoveryABI } from "@/generated";

export const useRecoveryModuleQuorum = (
  chainId: number,
  moduleAddress: string
): {quorum: string | null, isLoading: boolean} => {
  const [quorum, setQuorum] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const provider = getJsonRpcProvider(chainId);

  useEffect(() => {
    if (!moduleAddress || !provider) return;
    const fetchQuorum = async () => {
      setIsLoading(true);
      try {
        const contract = new Contract(
          moduleAddress,
          recoveryABI,
          provider
        );
        setQuorum((await contract.quorum()).toString());
      } catch (e) {
        setQuorum(null);
        console.log(e)
      }
      setIsLoading(false);
    };
    fetchQuorum();
  }, [moduleAddress]);

  return {quorum, isLoading};
};
