import { NextIntlClientProvider, hasLocale } from "next-intl";
import { headers } from "next/headers";
import Script from "next/script";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientParallaxProvider from "@/components/ClientParallaxProvider";
import CookieBanner from "@/components/CookieBanner";
import ConsentScripts from "@/components/ConsentScripts";

import "@/app/globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const { head } = messages;

  const urlObj = new URL(head.url);
  const baseUrl = urlObj.origin;

  return {
    title: head.title,
    description: head.description,
    keywords: head.keywords,
    authors: [{ name: "HomeStocker Team" }],
    alternates: {
      canonical: head.url,
      languages: {
        es: `${baseUrl}/es`,
        en: `${baseUrl}/en`,
        fr: `${baseUrl}/fr`,
        "x-default": baseUrl,
      },
    },
    openGraph: {
      type: "website",
      title: head.title,
      description: head.description,
      url: head.url,
      images: head.image,
    },
    twitter: {
      card: "summary_large_image",
      title: head.title,
      description: head.description,
      images: head.image,
    },
    metadataBase: new URL(baseUrl),
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  const headersList = await headers();
  const url =
    headersList.get("x-invoke-path") || headersList.get("referer") || "";

  const isAppRoute = url.includes("/app");

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1DDZ6SWC4V"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1DDZ6SWC4V');
          `}
        </Script>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header isAppRoute={isAppRoute} />
          <ClientParallaxProvider>
            <main>{children}</main>
            <ConsentScripts />
            <CookieBanner />
          </ClientParallaxProvider>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
