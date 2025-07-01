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
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const locale = params.locale;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const { head } = messages;

  const baseUrl = new URL(head.url).origin;

  const currentPath = `/${locale}`;

  const alternatesLanguages = routing.locales.reduce((acc, loc) => {
    acc[loc] = `${baseUrl}/${loc}${currentPath.replace(/^\/(es|en|fr)/, "")}`;
    return acc;
  }, {} as Record<string, string>);

  alternatesLanguages["x-default"] = `${baseUrl}/es${currentPath.replace(
    /^\/(es|en|fr)/,
    ""
  )}`;

  return {
    title: head.title,
    description: head.description,
    facebook: {
      appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
    },
    keywords: head.keywords,
    authors: [{ name: "CD Estepona Fans" }],
    alternates: {
      canonical: `${baseUrl}${currentPath}`,
      languages: alternatesLanguages,
    },
    openGraph: {
      type: "website",
      title: head.title,
      description: head.description,
      url: `${baseUrl}${currentPath}`,
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
      icon: "/favicon.png",
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
  const locale = params.locale;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const { head } = messages;

  const baseUrl = new URL(head.url).origin;

  const currentPath = `/${locale}`;

  const hreflangUrls = routing.locales.reduce((acc, loc) => {
    acc[loc] = `${baseUrl}/${loc}${currentPath.replace(/^\/(es|en|fr)/, "")}`;
    return acc;
  }, {} as Record<string, string>);

  hreflangUrls["x-default"] = `${baseUrl}/es${currentPath.replace(
    /^\/(es|en|fr)/,
    ""
  )}`;

  return (
    <html lang={locale} className={`${dmSans.variable} ${montserrat.variable}`}>
      <Head>
        {/* Canonical */}
        <link rel="canonical" href={`${baseUrl}${currentPath}`} />

        {/* Hreflang */}
        {Object.entries(hreflangUrls).map(([lang, href]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={href} />
        ))}
      </Head>
      <body className="min-h-screen flex flex-col">
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
              <main className="flex-grow">{children}</main>
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
