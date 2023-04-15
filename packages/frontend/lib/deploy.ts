import { BigNumber, Contract, ethers } from "ethers";
import { deployAndSetUpCustomModule } from "@gnosis.pm/zodiac";
import { abi as SafeAbi } from "@safe-global/safe-deployments/dist/assets/v1.3.0/gnosis_safe_l2.json";
import { Interface } from "ethers/lib/utils";
import {
  RECOVERY_MODULE_MASTER_COPY_ABI,
  getRecoveryModuleMasterCopyAddress,
} from "./constants";

export const AddressOne = "0x0000000000000000000000000000000000000001";

export const buildTransaction = (
  iface: Interface,
  to: string,
  method: string,
  params: any[],
  value?: string
) => {
  return {
    to,
    data: iface.encodeFunctionData(method, params),
    value: value || "0",
  };
};

export { SafeAbi };

type JsonRpcProvider = ethers.providers.JsonRpcProvider;

interface RecoveryModuleParams {
  recoverers: string[];
  quorum: number;
}

export function enableModule(safeAddress: string, module: string) {
  return buildTransaction(new Interface(SafeAbi), safeAddress, "enableModule", [
    module,
  ]);
}

const fundModule = (safeAddress: string, module: string, value: BigNumber) => {
  return {to: module, value: value.toString(), data: "0x"};
};

const fundingAmount = (chainId: number) => {
  switch (chainId) {
    case 5:
      return BigNumber.from("10000000000000000");
    case 100:
      return BigNumber.from("500000000000000000");
  }
  throw new Error("Unsupported chainId");
};

export function deployRecoveryModule(
  provider: JsonRpcProvider,
  safeAddress: string,
  chainId: number,
  recoverers: string[],
  quorum: number
) {
  console.log(safeAddress, chainId, recoverers, quorum);
  console.log(getRecoveryModuleMasterCopyAddress(chainId));
  const { transaction, expectedModuleAddress } = deployAndSetUpCustomModule(
    getRecoveryModuleMasterCopyAddress(chainId),
    RECOVERY_MODULE_MASTER_COPY_ABI,
    {
      values: [safeAddress, safeAddress, recoverers, quorum],
      types: ["address", "address", "address[]", "uint256"],
    },
    provider,
    chainId,
    Date.now().toString()
  );
  const enableRecoveryModuleTransaction = enableModule(
    safeAddress,
    expectedModuleAddress
  );
  const fundModuleTransaction = fundModule(
    safeAddress,
    expectedModuleAddress,
    fundingAmount(chainId)
  );

  return [
    {
      ...transaction,
      value: transaction.value.toString(),
    },
    enableRecoveryModuleTransaction,
    fundModuleTransaction,
  ];
}
