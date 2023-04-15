import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import RecoveryArtifact from "../evm/artifacts/contracts/Recovery.sol/Recovery.json";

export default defineConfig({
  out: "generated.ts",
  contracts: [{ name: "Recovery", abi: RecoveryArtifact.abi as any }],
  plugins: [react()],
});
