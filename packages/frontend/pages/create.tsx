import { useForm, useFieldArray } from "react-hook-form";
import { TrashIcon } from "@heroicons/react/20/solid";

export default function Home() {
  const { control, register, handleSubmit, watch } = useForm({
    defaultValues: {
      recoverycodes: [{ value: "" }, { value: "" }, { value: "" }],
    },
  });
  const onSubmit = (data: any) => console.log(data);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "recoverycodes",
  });

  return (
    <>
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
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
}
