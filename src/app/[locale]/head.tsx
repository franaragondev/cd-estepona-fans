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
      <meta name="author" content="CD Estepona Fans" />
      <meta name="keywords" content={head.keywords} />
      <meta name="theme-color" content="#FFFFFF" />
      <link rel="canonical" href={head.url} />

      {/* Idiomas */}
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr`} />
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={head.title} />
      <meta property="og:description" content={head.description} />
      <meta property="og:url" content={head.url} />
      <meta property="og:image" content={head.image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={head.title} />
      <meta name="twitter:description" content={head.description} />
      <meta name="twitter:image" content={head.image} />

      {/* Schema.org: Organización no oficial de fans */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "CD Estepona Fans",
            url: head.url,
            logo: `${baseUrl}/logo.webp`,
            description:
              "Página no oficial dedicada a los aficionados del CD Estepona. Noticias, partidos, galería y más.",
            sameAs: [
              "https://www.instagram.com/cdesteponafans/",
              "https://www.youtube.com/@CDEsteponaFans",
              "https://www.facebook.com/people/CD-Estepona-Fans/61558523420705/",
            ],
          }),
        }}
      />

      {/* Schema.org: WebSite con búsqueda */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "CD Estepona Fans",
            url: `${baseUrl}/es`,
            potentialAction: {
              "@type": "SearchAction",
              target: `${baseUrl}/es#search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}
