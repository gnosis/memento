import { useMemo } from "react"
import { SafeAppProvider } from "@safe-global/safe-apps-provider"
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk"
import { ethers } from "ethers"

const useSafeAppsSDKWithProvider = () => {
  const { sdk, safe, connected } = useSafeAppsSDK()
  const provider = useMemo(
    () => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)),
    [sdk, safe],
  )
  return { sdk, safe, provider, connected }
}

export default useSafeAppsSDKWithProvider