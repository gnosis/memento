import { useSafeOwners } from "@/lib/useSafeOwners";
import { useZodiacAvatar } from "@/lib/useZodiacAvatar";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

const CreateRecoveryProcess = ({
  chainId,
  moduleAddress,
}: {
  chainId: number;
  moduleAddress: string;
}) => {
  const { avatar: safeAddress, isLoading: isSafeLoading } = useZodiacAvatar(
    chainId,
    moduleAddress
  );
  const { owners, isLoading: isOwnersLoading } = useSafeOwners(
    chainId,
    safeAddress
  );

  if (isSafeLoading || isOwnersLoading) return <>Loading</>;

  if (!owners) return <></>;

  return (
    <div className="mx-auto max-w-lg">
      <div className="mt-10">
        <h3 className="text-sm font-medium text-gray-500">Recovery process for {safeAddress}</h3>
        <ul
          role="list"
          className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200"
        >
          {owners.map((owner, index) => (
            <li
              key={index}
              className="flex items-center justify-between space-x-3 py-4"
            >
              <div className="flex min-w-0 flex-1 items-center space-x-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {owner}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1.5 text-sm font-semibold leading-6 text-gray-900"
                >
                  Start recovery
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const RecoveryPage = () => {
  const { query } = useRouter();

  const chainId = parseInt(query.chainId as string);
  const moduleAddress = query.moduleAddress as string;
  const oldOwner = query.oldOwner as string;
  const newOwner = query.newOwner as string;

  if (!oldOwner || !newOwner) {
    return (
      <CreateRecoveryProcess
        chainId={chainId as number}
        moduleAddress={moduleAddress}
      />
    );
  }
  return <></>;
};

export default RecoveryPage;
