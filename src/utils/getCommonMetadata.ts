import { routing } from "@/i18n/routing";

type Locale = "es" | "en" | "fr";

const validLocales = routing.locales as unknown as Locale[];

export async function getCommonMetadata(locale: string, pagePath = "") {
  if (!validLocales.includes(locale as Locale)) {
    return {};
  }

  const typedLocale = locale as Locale;

  const messages = (await import(`../../messages/${typedLocale}.json`)).default;
  const { head } = messages;

  const urlObj = new URL(head.url);
  const baseUrl = urlObj.origin;
  const canonicalUrl = `${baseUrl}/${typedLocale}${pagePath}`;

  return {
    title: head.title,
    description: head.description,
    keywords: head.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: `${baseUrl}/es`,
        en: `${baseUrl}/en`,
        fr: `${baseUrl}/fr`,
        "x-default": `${baseUrl}/es`,
      },
    },
    openGraph: {
      type: "website",
      title: head.title,
      description: head.description,
      url: canonicalUrl,
      images: head.image,
    },
    twitter: {
      card: "summary_large_image",
      title: head.title,
      description: head.description,
      images: head.image,
    },
    metadataBase: new URL(baseUrl),
  };
}
