"use client";

type HeadProps = {
  messages: {
    head: {
      title: string;
      description: string;
      url: string;
      image: string;
      keywords: string;
    };
  };
};

export default function Head({ messages }: HeadProps) {
  const { head } = messages;

  const urlObj = new URL(head.url);
  const baseUrl = urlObj.origin;

  return (
    <>
      <title>{head.title}</title>
      <meta name="description" content={head.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="HomeStocker Team" />
      <meta name="keywords" content={head.keywords} />

      {/* Theme color for mobile browsers */}
      <meta name="theme-color" content="#FFFFFF" />

      {/* Canonical URL */}
      <link rel="canonical" href={head.url} />

      {/* Hreflang alternate versions */}
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr`} />
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={head.title} />
      <meta property="og:description" content={head.description} />
      <meta property="og:url" content={head.url} />
      <meta property="og:image" content={head.image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={head.title} />
      <meta name="twitter:description" content={head.description} />
      <meta name="twitter:image" content={head.image} />

      {/* Schema.org: Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "HomeStocker",
            url: head.url,
            logo: `${baseUrl}/logo.webp`,
            sameAs: ["https://www.instagram.com/homestockerapp/"],
          }),
        }}
      />

      {/* Schema.org: WebSite with SearchAction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "HomeStocker",
            url: `${baseUrl}/es`,
            potentialAction: {
              "@type": "SearchAction",
              target: `${baseUrl}/es#search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* Schema.org: MobileApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            name: "HomeStocker",
            url: `${baseUrl}/es`,
            applicationCategory: "LifestyleApplication",
            operatingSystem: ["iOS", "Android", "Web"],
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
            },
          }),
        }}
      />
    </>
  );
}
