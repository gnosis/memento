import { useForm, useFieldArray } from "react-hook-form";
import { TrashIcon } from "@heroicons/react/20/solid";
import { deployRecoveryModule } from "@/lib/deploy";
import useSafeAppsSDKWithProvider from "@/lib/useSafeAppsSDKWithProvider";
import { createSigningKey } from "@/lib/signingKeys";

const CreateForm = ({
  onSetupRecovery,
}: {
  onSetupRecovery: (codes: string[], quorum: number) => void;
}) => {
  const { control, register, handleSubmit, watch } = useForm({
    defaultValues: {
      recoverycodes: [{ value: "" }, { value: "" }, { value: "" }],
      quorum: 2,
      delayValue: 2,
      delayUnit: "days",
    },
  });
  const delayValue = watch("delayValue");
  const delayPlural = delayValue > 1;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "recoverycodes",
  });

  const onSubmit = (data: any) => {
    onSetupRecovery(
      data.recoverycodes.map((r: any) => r.value),
      data.quorum
    );
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8">
          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <h2>Setup your recovery codes</h2>
            {fields.map((field, index) => {
              const isOnly = fields.length === 1;
              return (
                <div key={field.id} className="flex gap-4">
                  <input
                    {...register(`recoverycodes.${index}.value`)}
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="MyRandomPassphrase"
                  />
                  <button
                    className="disabled:invisible"
                    disabled={isOnly}
                    onClick={() => remove(index)}
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
            <div className="flex items-center gap-1">
              <input
                {...register("quorum", {
                  valueAsNumber: true,
                  required: true,
                  min: 1,
                  max: fields.length,
                })}
                type="number"
                className="block rounded-md w-16 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="n"
              />
              <span>
                out of {fields.length} are required to recover the account
              </span>
            </div>
            {/*
            <div className="flex items-center gap-1">
              <input
                {...register("delayValue", {
                  valueAsNumber: true,
                  required: true,
                  min: 1,
                })}
                type="number"
                className="block rounded-md w-16 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="n"
              />
              <select
                {...register("delayUnit", { required: true })}
                className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="weeks">{delayPlural ? "Weeks" : "Week"}</option>
                <option value="days">{delayPlural ? "Days" : "Day"}</option>
                <option value="hours">{delayPlural ? "Hours" : "Hour"}</option>
                <option value="seconds">{delayPlural ? "Seconds" : "Second"}</option>
              </select>
              <span>
                delay before the recovery is executed
              </span>
            </div>*/}
            <div className="flex gap-2">
              <button
                className="rounded bg-indigo-50 px-2 py-1 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                onClick={() => append({ value: "" })}
              >
                Add word
              </button>
              <button
                type="submit"
                className="rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default function Create() {
  const { connected, safe, provider, sdk } = useSafeAppsSDKWithProvider();

  const setupRecovery = async (mementos: string[], quorum: number) => {
    const { chainId, safeAddress } = safe;
    const recovererAddresses = mementos.map(
      (memento) => createSigningKey(memento).address
    );
    const deployTx = deployRecoveryModule(
      provider,
      safeAddress,
      chainId,
      recovererAddresses,
      quorum
    );
    await sdk.txs.send({ txs: deployTx });
  };

  if (!connected) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CreateForm onSetupRecovery={setupRecovery} />
    </>
  );
}
