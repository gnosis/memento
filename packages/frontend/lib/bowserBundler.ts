import { IEntryPoint__factory } from "@/typechain-types";
// import { UserOperationStruct } from "@/typechain-types/contracts/Account";
import { ethers } from "ethers";
import { UserOperation } from "../lib/userOp";

const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATEKEY;
if (PRIVATE_KEY == null) {
  throw new Error("NEXT_PUBLIC_PRIVATEKEY is not defined");
}

const ENTRYPOINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

export const bundle = (
  provider: ethers.providers.BaseProvider,
  userOps: UserOperation
) => {
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const entrypoint = IEntryPoint__factory.connect(ENTRYPOINT, wallet);

  return entrypoint.handleOps([userOps], wallet.getAddress());
};
