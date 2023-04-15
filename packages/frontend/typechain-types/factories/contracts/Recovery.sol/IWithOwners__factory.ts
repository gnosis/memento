/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IWithOwners,
  IWithOwnersInterface,
} from "../../../contracts/Recovery.sol/IWithOwners";

const _abi = [
  {
    inputs: [],
    name: "getOwners",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "prevOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "oldOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "swapOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IWithOwners__factory {
  static readonly abi = _abi;
  static createInterface(): IWithOwnersInterface {
    return new utils.Interface(_abi) as IWithOwnersInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IWithOwners {
    return new Contract(address, _abi, signerOrProvider) as IWithOwners;
  }
}
