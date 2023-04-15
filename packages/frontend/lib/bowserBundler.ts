import { IEntryPoint__factory } from "@/typechain-types";
// import { UserOperationStruct } from "@/typechain-types/contracts/Account";
import { ethers } from "ethers";
import { UserOperation } from "../lib/userOp";
import { ENTRYPOINT_ADDRESS } from "./constants";

const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATEKEY;
if (PRIVATE_KEY == null) {
  throw new Error("NEXT_PUBLIC_PRIVATEKEY is not defined");
}

export const bundle = (
  provider: ethers.providers.BaseProvider,
  userOps: UserOperation
) => {
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const entrypoint = IEntryPoint__factory.connect(ENTRYPOINT_ADDRESS, wallet);

  return entrypoint.handleOps([userOps], wallet.getAddress());
};
