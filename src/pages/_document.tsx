import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en-PK">
      <Head>
        {/* Viewport meta for proper responsive scaling */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <link rel="preload" as="image" href="/3mwinterlogo.png" />
        <link rel="icon" href="/3mlogosmall.svg" type="image/svg+xml" />
      </Head>
      <body className="antialiased font-outfit">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
