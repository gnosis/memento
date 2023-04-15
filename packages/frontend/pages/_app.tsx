import "@/styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import SafeProvider from "@safe-global/safe-apps-react-sdk";
import useIsMounted from "@/lib/useIsMounted";

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()

  if (!isMounted) {
    return <></>
  }

  return (
    <React.StrictMode>
      <SafeProvider>
        <Component {...pageProps} />
      </SafeProvider>
    </React.StrictMode>
  );
}
