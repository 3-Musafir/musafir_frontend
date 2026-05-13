import Head from "next/head";

import DmcLandingPage from "@/components/DmcLandingPage";

export default function DmcPage() {
  return (
    <>
      <Head>
        <title>3Musafir DMC | Destination Management Company in Pakistan</title>
        <meta
          name="description"
          content="3Musafir Travels is a B2B destination management company in Pakistan for international travel partners."
        />
      </Head>
      <DmcLandingPage />
    </>
  );
}
