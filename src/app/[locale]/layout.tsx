import { NextIntlClientProvider, hasLocale } from "next-intl";
import Script from "next/script";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "../context/AuthContext";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";
import ClientParallaxProvider from "@/components/ClientParallaxProvider";
import CookieBanner from "@/components/CookieBanner";
import ConsentScripts from "@/components/ConsentScripts";
import Head from "next/head";

import "@/app/globals.css";
import { DM_Sans, Montserrat } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
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
    authors: [{ name: "CD Estepona Fans" }],
    alternates: {
      canonical: head.url,
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
  params: { locale: string };
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const { head } = messages;
  const urlObj = new URL(head.url);
  const baseUrl = urlObj.origin;

  // URLs hreflang
  const hreflangUrls = {
    es: `${baseUrl}/es${urlObj.pathname.replace(/^\/(es|en|fr)/, "")}`,
    en: `${baseUrl}/en${urlObj.pathname.replace(/^\/(es|en|fr)/, "")}`,
    fr: `${baseUrl}/fr${urlObj.pathname.replace(/^\/(es|en|fr)/, "")}`,
  };

  return (
    <html lang={locale} className={`${dmSans.variable} ${montserrat.variable}`}>
      <Head>
        {/* Canonical */}
        <link rel="canonical" href={head.url} />

        {/* Hreflang for each language */}
        {Object.entries(hreflangUrls).map(([lang, href]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={href} />
        ))}

        {/* x-default */}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}/es${urlObj.pathname.replace(/^\/(es|en|fr)/, "")}`}
        />
      </Head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QVPHJBS6Y0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QVPHJBS6Y0');
          `}
        </Script>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <Header />
            <ScrollToTop />
            <ClientParallaxProvider>
              <main>{children}</main>
              <ConsentScripts />
              <CookieBanner />
            </ClientParallaxProvider>
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
