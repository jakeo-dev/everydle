import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased bg-gradient-to-br from-yellow-300/50 to-green-300/50 text-gray-800 text-center max-w-full selection:bg-blue-950/80 selection:text-white mx-auto transition-all">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
