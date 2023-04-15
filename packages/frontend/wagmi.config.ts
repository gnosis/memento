import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import RecoveryArtifact from "../evm/artifacts/contracts/Recovery.sol/Recovery.json";
import IEntrypointArtifact from "../evm/artifacts/@account-abstraction/contracts/interfaces/IEntryPoint.sol/IEntryPoint.json";

export default defineConfig({
  out: "generated.ts",
  contracts: [
    { name: "Recovery", abi: RecoveryArtifact.abi as any },
    { name: "IEntryPoint", abi: IEntrypointArtifact.abi as any },
  ],
  plugins: [react()],
});
