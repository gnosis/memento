import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";

export default function Home() {
  const { connected, safe} = useSafeAppsSDK();

  return (
    <>
      <div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <form className="mt-8 space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="sr-only">
                Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="0x871ee6f5df413e83427cab46e588f8b3e59474f7"
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Start recovery
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
