import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

type Locale = "es" | "en" | "fr";

const validLocales = routing.locales as unknown as Locale[];

export async function getCommonMetadata(
  locale: string,
  pagePath = ""
): Promise<Metadata | object> {
  if (!validLocales.includes(locale as Locale)) {
    return {};
  }

  const typedLocale = locale as Locale;
  try {
    const messages = (await import(`../../messages/${typedLocale}.json`))
      .default;
    const { head } = messages;

    const urlObj = new URL(head.url);
    const baseUrl = urlObj.origin;
    const path = pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
    const canonicalUrl = `${baseUrl}/${typedLocale}${path}`;

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

      other: {
        "fb:app_id": process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
      },
    };
  } catch (error) {
    console.error(`Error loading messages for locale: ${typedLocale}`, error);
    return {};
  }
}
