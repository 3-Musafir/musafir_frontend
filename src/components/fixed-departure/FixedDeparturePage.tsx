'use client';

import Head from 'next/head';
import Dashboard from '@/components/dashboard/Dashboard';
import Footer from '@/components/Footer';
import { siteName, siteUrl } from '@/lib/seo/seoConfig';

const fixedDeparturePath = '/fixed-departure';
const fixedDepartureUrl = `${siteUrl}${fixedDeparturePath}`;

const description =
  'Explore upcoming flagship journeys and community-led group travel experiences with 3Musafir.';

export default function FixedDeparturePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${fixedDepartureUrl}#fixed-departure`,
    url: fixedDepartureUrl,
    name: '3Musafir Fixed Departures',
    description,
    isPartOf: {
      '@id': `${siteUrl}#website`,
    },
    about: [
      'Pakistan group tours',
      'Women-first travel experiences',
      'Community-led fixed departures',
      'Customized trips',
      'International group trips',
    ],
    provider: {
      '@id': `${siteUrl}#organization`,
      name: siteName,
    },
  };

  return (
    <>
      <Head>
        <meta name="description" content={description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Dashboard />
      <Footer />
    </>
  );
}
