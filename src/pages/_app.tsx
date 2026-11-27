import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { useEffect } from "react";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { Analytics } from "@vercel/analytics/react";

import { Chivo } from "next/font/google";
const chivo = Chivo({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "light" : "dark");
  }, []);

  return (
    <main
      className={`${chivo.className} bg-linear-to-br from-yellow-300/40 to-green-300/40 dark:from-yellow-500/10 dark:to-green-500/10`}
    >
      <Component {...pageProps} />
      <Analytics />
    </main>
  );
}
