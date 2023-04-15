import { ethers } from "ethers";
import { SigningKey, computeAddress, keccak256 } from "ethers/lib/utils";

export const createSigningKey = (phrase: string) => {
  const signingKey = new SigningKey(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(phrase))
  );

  return { signingKey, address: computeAddress(signingKey.publicKey) };
}

export const sign = (sk: SigningKey, msg: string) => {
  const message = ethers.utils.arrayify(keccak256(msg));
  return ethers.utils.joinSignature(
    sk.signDigest(ethers.utils.hashMessage(message))
  );
}