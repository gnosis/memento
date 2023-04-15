import { InfuraProvider, JsonRpcProvider } from "@ethersproject/providers";

export const MODULE_PROXY_FACTORY_ADDRESS =
  "0x000000000000aDdB49795b0f9bA5BC298cDda236";

export const DEFAULT_SALT =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const getSafeTransactionService = (chainId: number) => {
  switch (chainId) {
    case 5:
      return "https://safe-transaction-goerli.safe.global/";
  }
  return "";
};

export const getJsonRpcProvider = (chainId: number) => {
  const infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY;
  switch (chainId) {
    case 5:
      return new InfuraProvider("goerli", infuraKey);
  }
  return null;
};

export const getRecoveryModuleMasterCopyAddress = (chainId: number) => {
  switch (chainId) {
    case 5:
      return "0x7c1C338D11f79cA170AD012A7Bbc177D07a25A33";
  }
  return "";
};

export const RECOVERY_MODULE_MASTER_COPY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "avatar",
        type: "address",
      },
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_recoverers",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_quorum",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "InvalidRecoverer",
    type: "error",
  },
  {
    inputs: [],
    name: "NoQuorum",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "guard_",
        type: "address",
      },
    ],
    name: "NotIERC165Compliant",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousAvatar",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAvatar",
        type: "address",
      },
    ],
    name: "AvatarSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "guard",
        type: "address",
      },
    ],
    name: "ChangedGuard",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "Replace",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousTarget",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newTarget",
        type: "address",
      },
    ],
    name: "TargetSet",
    type: "event",
  },
  {
    inputs: [],
    name: "avatar",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGuard",
    outputs: [
      {
        internalType: "address",
        name: "_guard",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "guard",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct Recovery.Permit[]",
        name: "permits",
        type: "tuple[]",
      },
      {
        components: [
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
        internalType: "struct Recovery.Replacement[]",
        name: "replacements",
        type: "tuple[]",
      },
    ],
    name: "recover",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_avatar",
        type: "address",
      },
    ],
    name: "setAvatar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_guard",
        type: "address",
      },
    ],
    name: "setGuard",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_target",
        type: "address",
      },
    ],
    name: "setTarget",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "initializeParams",
        type: "bytes",
      },
    ],
    name: "setUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "target",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
