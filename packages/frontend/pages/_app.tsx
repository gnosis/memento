import "@/styles/globals.css";
import type { AppProps } from "next/app";
import SafeProvider from "@safe-global/safe-apps-react-sdk";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <SafeProvider>
        <Component {...pageProps} />
      </SafeProvider>
    </React.StrictMode>
  );
}
