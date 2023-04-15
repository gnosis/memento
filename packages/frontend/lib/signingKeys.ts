import { ethers } from "ethers";
import { SigningKey, computeAddress } from "ethers/lib/utils";

export const createSigningKey = (phrase: string) => {
  const signingKey = new SigningKey(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(phrase))
  );

  return { signingKey, address: computeAddress(signingKey.publicKey) };
}

export const signWithKey = (signingKey: SigningKey, message: string) => {
  return signingKey.signDigest(ethers.utils.keccak256(message));
}