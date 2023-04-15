import { useRecoveryModuleQuorum } from "@/lib/useRecoveryModule";
import { useSafeModules } from "@/lib/useSafeModules";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import Link from "next/link";

const RecoveryModule = ({
  chainId,
  moduleAddress,
}: {
  chainId: number;
  moduleAddress: string;
}) => {
  const { quorum } = useRecoveryModuleQuorum(chainId, moduleAddress);
  return (
    <div className="w-full bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="mt-2 sm:flex sm:items-start sm:justify-between sm:items-center">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            {moduleAddress}
          </h3>
          <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
            <Link href={`/recover/${chainId}/${moduleAddress}`}>
              <p className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Start recovery
              </p>
            </Link>
          </div>
        </div>
        <div className="max-w-xl text-sm text-gray-500">
          {quorum && (
            <p>{quorum} mementos are required to recover your account.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const DeployRecoveryModule = () => (
  <div className="w-full bg-white shadow sm:rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <div className="mt-2 sm:flex sm:items-start sm:justify-between sm:items-center">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Setup a your recovery mementos
        </h3>
        <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
          <Link href="/create">
            <p className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Setup
            </p>
          </Link>
        </div>
      </div>
      <div className="max-w-xl text-sm text-gray-500">
        <p>Create memories, save lives.</p>
      </div>
    </div>
  </div>
);

const RecoveryList = () => {
  const { safe } = useSafeAppsSDK();
  const { modules } = useSafeModules(safe.chainId, safe.safeAddress);

  return (
    <>
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8">
          {modules?.map((moduleAddress) => (
            <RecoveryModule
              key={moduleAddress}
              chainId={safe.chainId}
              moduleAddress={moduleAddress}
            />
          ))}
          <DeployRecoveryModule />
        </div>
      </div>
    </>
  );
};

export default function Home() {
  const { connected, safe } = useSafeAppsSDK();
  if (!connected) return <></>;
  if (!safe) return <></>;
  return <RecoveryList />;
}
