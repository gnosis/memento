import { recoveryABI } from "@/generated";
import { bundle } from "@/lib/bowserBundler";
import {
  ENTRYPOINT_ADDRESS,
  RECOVERY_MODULE_MASTER_COPY_ABI,
  getJsonRpcProvider,
} from "@/lib/constants";
import { createSigningKey, sign } from "@/lib/signingKeys";
import { useSafeOwners } from "@/lib/useSafeOwners";
import { useZodiacAvatar } from "@/lib/useZodiacAvatar";
import { DefaultsForUserOp, signUserOp } from "@/lib/userOp";
import { Contract, Wallet } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

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
  const {
    register,
    watch,
    formState: { isValid },
  } = useForm({});

  if (isSafeLoading || isOwnersLoading) return <>Loading</>;
  if (!owners) return <></>;

  const { oldAccount, newAccount } = watch();

  const recoveryUrl = `${window.location}/?oldAccount=${oldAccount}&newAccount=${newAccount}`;
  const copyRecoveryUrl = () => navigator.clipboard.writeText(recoveryUrl);

  return (
    <>
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl space-y-8">
          <h2>Start recovery for {safeAddress}</h2>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Old account to recover from
            </label>
            <select
              {...register("oldAccount", {
                required: true,
                validate: (value) => isAddress(value),
              })}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              {owners.map((owner) => (
                <option>{owner}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              New account to recover to
            </label>
            <input
              {...register("newAccount", {
                required: true,
                validate: (value) => isAddress(value),
              })}
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0x4aD6D9861f9569dc929B6e8F33A73bCA16ca0d91"
            />
          </div>
          {isValid && (
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex flex-col gap-3">
                <div className="mx-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    Share the following link with the people with the recovery
                    mementos
                  </p>
                  {/*
                  <p className="text-sm md:ml-6 md:mt-0">
                    <button
                      onClick={copyRecoveryUrl}
                      className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                    >
                      Copy
                    </button>
                  </p>
                  */}
                </div>
                <div className="mx-3 flex-1 md:flex md:justify-between font-mono break-all">
                  <p className="text-xs text-blue-700">{recoveryUrl}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const RecoveryMementoInput = ({
  chainId,
  moduleAddress,
  oldAccount,
  newAccount,
}: {
  chainId: number;
  moduleAddress: string;
  oldAccount: string;
  newAccount: string;
}) => {
  const { register, handleSubmit } = useForm();

  const handleRecover = async (memento: string) => {
    const { signingKey, address } = createSigningKey(memento);
    const provider = getJsonRpcProvider(chainId);
    const signer = new Wallet(signingKey, provider);
    const contract = new Contract(moduleAddress, recoveryABI, signer);
    const { data: callData } = await contract.populateTransaction.recover(
      address,
      [[oldAccount, newAccount]]
    );
    const userOp = {
      ...DefaultsForUserOp,
      sender: moduleAddress,
      callData: callData as string,
    };
    const signedUserOp = await signUserOp(
      userOp,
      signer,
      ENTRYPOINT_ADDRESS,
      chainId
    );
    console.log(signedUserOp);

    if (provider == null) throw new Error("Provider is null");
    const result = await bundle(provider, userOp);
    console.log(result);
  };

  const onSubmit = (data: any) => handleRecover(data.memento);

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-8"
      >
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Recovery memento
          </label>
          <input
            {...register("memento")}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="MySecretMemento"
          />
        </div>
        <div>
          <button
            type="submit"
            className="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Recover
          </button>
        </div>
      </form>
    </div>
  );
};

const RecoveryPage = () => {
  const { query } = useRouter();

  const chainId = parseInt(query.chainId as string);
  const moduleAddress = query.moduleAddress as string;
  const oldOwner = query.oldAccount as string;
  const newOwner = query.newAccount as string;

  if (!oldOwner || !newOwner) {
    return (
      <CreateRecoveryProcess chainId={chainId} moduleAddress={moduleAddress} />
    );
  }

  return (
    <RecoveryMementoInput
      chainId={chainId}
      moduleAddress={moduleAddress}
      oldAccount={oldOwner}
      newAccount={newOwner}
    />
  );
};

export default RecoveryPage;
