import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Lexend } from "next/font/google";

const lexend = Lexend({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={lexend.className}>
      <Component {...pageProps} />
    </main>
  );
}
