import { DefaultSeoProps, FAQPageJsonLd, NextSeo, WebPageJsonLd } from "next-seo";
import { buildCanonical, siteName, toAbsoluteUrl } from "@/lib/seo/seoConfig";

export type FaqItem = { question: string; answer: string };

type SeoHeadProps = {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  noindex?: boolean;
  faqItems?: FaqItem[];
};

export default function SeoHead({
  title,
  description,
  canonicalPath,
  ogImage,
  noindex,
  faqItems,
}: SeoHeadProps) {
  const canonicalUrl = buildCanonical(canonicalPath);
  const imageUrl = toAbsoluteUrl(ogImage);
  const openGraph: DefaultSeoProps["openGraph"] = {
    type: "website",
    url: canonicalUrl,
    title,
    description,
    site_name: siteName,
    locale: "en_PK",
    images: imageUrl ? [{ url: imageUrl, alt: title }] : undefined,
  };

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonicalUrl}
        noindex={noindex}
        nofollow={noindex}
        openGraph={openGraph}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <WebPageJsonLd
        id={`${canonicalUrl}#webpage`}
        url={canonicalUrl}
        title={title}
        description={description}
      />
      {faqItems && faqItems.length > 0 ? (
        <FAQPageJsonLd
          mainEntity={faqItems.map((item) => ({
            questionName: item.question,
            acceptedAnswerText: item.answer,
          }))}
        />
      ) : null}
    </>
  );
}
