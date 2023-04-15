import { getSafeTransactionService } from "./constants";

const getSafeOwners = async (chainId: number, safeAddress: string) => {
  const url = `${getSafeTransactionService(chainId)}/api/v1/safes/${safeAddress}.`;
  const response = await fetch(url)
  const body = await response.json()
  return body.owners
}