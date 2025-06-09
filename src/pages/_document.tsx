import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="mx-auto max-w-full bg-gradient-to-br from-yellow-300/40 to-green-300/40 text-center text-gray-800 antialiased transition-all selection:bg-blue-950/80 selection:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
