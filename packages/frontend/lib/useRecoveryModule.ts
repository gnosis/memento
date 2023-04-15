import { useEffect, useState } from "react";
import { RECOVERY_MODULE_MASTER_COPY_ABI, getJsonRpcProvider } from "./constants";
import { Contract } from "ethers";

export const useZodiacAvatar = (
  chainId: number,
  moduleAddress: string
): {avatar: string | null, isLoading: boolean} => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const provider = getJsonRpcProvider(chainId);

  useEffect(() => {
    if (!moduleAddress || !provider) return;
    const fetchAvatar = async () => {
      setIsLoading(true);
      try {
        const contract = new Contract(
          moduleAddress,
          RECOVERY_MODULE_MASTER_COPY_ABI,
          provider
        );
        setAvatar(await contract.avatar());
      } catch (e) {
        setAvatar(null);
      }
      setIsLoading(false);
    };
    fetchAvatar();
  }, [moduleAddress]);

  return {avatar, isLoading};
};
