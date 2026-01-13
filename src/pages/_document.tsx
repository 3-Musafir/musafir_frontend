import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preload" as="image" href="/3mwinterlogo.png" />
      </Head>
      <body className="antialiased font-outfit">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
