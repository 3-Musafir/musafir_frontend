'use client';

import Head from 'next/head';
import Dashboard from '@/components/dashboard/Dashboard';
import { siteName, siteUrl } from '@/lib/seo/seoConfig';

const description =
  '3Musafir is a Pakistan-based travel company offering community-led group tours, women-first travel experiences, customized trips, international group trips, and inbound DMC services for foreign travel agencies.';

function RootIndex() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}#homepage`,
    url: siteUrl,
    name: '3Musafir',
    description,
    isPartOf: {
      '@id': `${siteUrl}#website`,
    },
    about: [
      'Pakistan group tours',
      'Women-first travel experiences',
      'Customized trips',
      'International group trips',
      'Pakistan DMC services',
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
    </>
  );
}

export default RootIndex;
