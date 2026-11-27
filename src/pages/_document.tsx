import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="mx-auto max-w-full text-center text-neutral-800 antialiased transition-all selection:bg-blue-950/80 selection:text-white dark:bg-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
